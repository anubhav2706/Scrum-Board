import { IsString, IsEnum, IsArray, IsOptional, IsDateString } from 'class-validator';
import { TicketStatus, TicketPriority } from '../../../../packages/types/index';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['todo', 'in-progress', 'done'])
  status: TicketStatus;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: TicketPriority;

  @IsArray()
  @IsString({ each: true })
  assigneeIds: string[];

  @IsString()
  projectId: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
} 