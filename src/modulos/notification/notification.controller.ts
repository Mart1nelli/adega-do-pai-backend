import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
import { Roles } from '../../auth/roles.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Roles('admin')
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.notificationService.findOne(+id, userId);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.notificationService.update(+id, updateNotificationDto, userId);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.notificationService.remove(+id, userId);
  }
}
