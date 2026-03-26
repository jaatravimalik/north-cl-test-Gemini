import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsNotEmpty()
  @IsString()
  institution: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
