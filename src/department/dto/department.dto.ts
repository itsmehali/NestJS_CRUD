import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Type } from 'class-transformer';

export class DepartmentDataDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
