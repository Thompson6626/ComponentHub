package com.comphub.component;

import com.comphub.component.category.Category;
import com.comphub.component.userComponentVote.UserComponentVote;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Set;

public class ComponentSpecification {

    public static Specification<Component> hasCategories(Set<Category> categories) {
        return (root, query, builder) -> {
            if (categories == null || categories.isEmpty()) {
                return builder.conjunction(); // return an empty condition if no categories are provided
            }

            // Join with the Category entity (assuming Component has a Set<Category> categories)
            Join<Component, Category> categoryJoin = root.join("categories");

            // Create a Predicate for each category in the set
            Predicate[] categoryPredicates = categories.stream()
                    .map(category -> builder.equal(categoryJoin, category))  // Compare with the given category
                    .toArray(Predicate[]::new);

            // Combine all the predicates using AND to ensure that the component has all the categories
            return builder.and(categoryPredicates);
        };
    }

    public static Specification<Component> sortByVotes(boolean sortByUpvotes) {
        return (root, query, criteriaBuilder) -> {
            // Join the votes table
            Join<Component, UserComponentVote> votes = root.join("votes", JoinType.LEFT);

            // Filter votes by type
            Predicate voteTypePredicate = criteriaBuilder.equal(
                    votes.get("voteType"),
                    sortByUpvotes ? UserComponentVote.VoteType.UPVOTE : UserComponentVote.VoteType.DOWNVOTE
            );

            // Aggregate and count votes of the specific type
            Expression<Long> voteCount = criteriaBuilder.count(criteriaBuilder.selectCase()
                    .when(voteTypePredicate, votes.get("id"))
                    .otherwise((Long) null));

            // Group by component ID to avoid duplicates
            assert query != null;
            query.groupBy(root.get("id"));

            // Apply sorting
            query.orderBy(criteriaBuilder.desc(voteCount));

            return null; // This modifies the query and doesn't need a predicate
        };
    }



}
