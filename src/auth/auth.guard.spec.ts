import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard(UseGuards)).toBeDefined();
  });
});
