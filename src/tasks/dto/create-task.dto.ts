import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // Temporal: hasta que exista @CurrentUser(), el dueño se manda a mano.
  @IsInt()
  ownerId: number;
}
