import { IsNotEmpty, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsOptional()
  @IsString()
  review?: string;
}
