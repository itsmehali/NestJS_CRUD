import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsDate()
  birthday?: Date;
  id: number;
}
