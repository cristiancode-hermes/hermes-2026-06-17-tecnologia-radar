import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VotesService } from './vote.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@ApiTags('votes')
@Controller()
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post('technologies/:id/votes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update vote for a technology' })
  createOrUpdate(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CreateVoteDto,
  ) {
    return this.votesService.createOrUpdate(+id, req.user.userId, dto);
  }

  @Get('technologies/:id/votes')
  @ApiOperation({ summary: 'List votes for a technology' })
  findByTechnology(@Param('id') id: string) {
    return this.votesService.findByTechnology(+id);
  }

  @Get('votes/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s votes' })
  findMyVotes(@Request() req) {
    return this.votesService.findByUser(req.user.userId);
  }

  @Patch('votes/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vote' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateVoteDto,
  ) {
    return this.votesService.update(+id, req.user.userId, dto);
  }

  @Delete('votes/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vote' })
  delete(@Param('id') id: string, @Request() req) {
    return this.votesService.delete(+id, req.user.userId);
  }
}
