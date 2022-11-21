import { Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolvers';


@Module({
    providers: [ProfileResolver],
})
export class ProfileModule {}
