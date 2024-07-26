// src/dto/test.dto.ts

import { IsInt, IsString, IsDate, IsOptional } from 'class-validator'

export class TestDto {
  @IsInt()
  readonly EMPLOYEE_ID: number;

  @IsString()
  readonly FIRST_NAME: string;

  @IsString()
  readonly LAST_NAME: string;

  @IsOptional()
  @IsDate()
  readonly BIRTH_DATE?: Date;

  @IsOptional()
  @IsDate()
  readonly HIRE_DATE?: Date;

  @IsOptional()
  @IsString()
  readonly JOB_TITLE?: string;
}