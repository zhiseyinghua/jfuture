import { TeamGuard } from './team.guard';

describe('TeamGuard', () => {
  it('should be defined', () => {
    expect(new TeamGuard(TeamGuard)).toBeDefined();
  });
});
