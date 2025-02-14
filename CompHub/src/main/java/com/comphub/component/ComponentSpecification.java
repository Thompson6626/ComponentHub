package com.comphub.component;

import com.comphub.component.userComponentVote.UserComponentVote;

import com.comphub.component.userComponentVote.VoteType;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.Set;

public class ComponentSpecification {

    private static Specification<Component> sortBy(String field, boolean descending) {
        return (root, query, criteriaBuilder) -> {
            query.orderBy(descending
                    ? criteriaBuilder.desc(root.get(field))
                    : criteriaBuilder.asc(root.get(field))
            );
            return criteriaBuilder.conjunction();
        };
    }


    public static Specification<Component> sortByVotes(boolean sortByUpvotes) {
        return (root, query, criteriaBuilder) -> {
            Join<Component, UserComponentVote> votes = root.join("votes", JoinType.LEFT);

            Predicate voteTypePredicate = criteriaBuilder.equal(
                    votes.get("voteType"),
                    sortByUpvotes ? VoteType.UPVOTE : VoteType.DOWNVOTE
            );

            Expression<Long> voteCount = criteriaBuilder.count(votes);

            query.groupBy(root.get("id"));
            query.orderBy(sortByUpvotes
                    ? criteriaBuilder.desc(voteCount)
                    : criteriaBuilder.asc(voteCount));

            return criteriaBuilder.conjunction();
        };
    }

    public static Specification<Component> filterByUsername(String username) {
        return (root, query, builder) -> StringUtils.hasText(username)
                ? builder.equal(root.get("user").get("username"), username)
                : builder.conjunction();
    }


    public static Specification<Component> applySorting(String sortBy, String order) {
        boolean descending = order.equals("desc");

        return switch (sortBy) {
            case "name", "createdAt", "updatedAt" -> sortBy(sortBy, descending);
            case "upVotes" -> sortByVotes(descending);
            default -> throw new IllegalArgumentException("Invalid sort by: " + sortBy);
        };
    }
    public static Specification<Component> searchByName(String name) {
        return (root, query, criteriaBuilder) -> {
            var exactMatch = criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
            var containsMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");

            query.orderBy(
                    criteriaBuilder.desc(criteriaBuilder.selectCase()
                            .when(exactMatch, 1)
                            .otherwise(0)), // Order by exact match first
                    criteriaBuilder.asc(root.get("name")) // Then alphabetically
            );

            return criteriaBuilder.or(exactMatch, containsMatch);
        };
    }

    public static Specification<Component> findByCategoryNames(Set<String> categoryNames) {
        return (root, query, criteriaBuilder) -> {
            var categoriesJoin = root.join("categories", JoinType.INNER);

            Predicate categoryPredicate = categoriesJoin.get("name").in(categoryNames);

            query.groupBy(root.get("id"));
            query.having(criteriaBuilder.equal(
                    criteriaBuilder.countDistinct(categoriesJoin.get("name")), categoryNames.size()));

            return categoryPredicate;
        };
    }

}
