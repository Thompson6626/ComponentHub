import { CamelCaseToSeparetedPipe } from './camel-case-to-separeted.pipe';

describe('CamelCaseToSeparetedPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCaseToSeparetedPipe();
    expect(pipe).toBeTruthy();
  });
});
