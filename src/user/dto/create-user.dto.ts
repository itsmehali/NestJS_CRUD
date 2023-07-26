import {
  IsNotEmpty,
  IsString,
  IsDate,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  birthday: Date;
}
