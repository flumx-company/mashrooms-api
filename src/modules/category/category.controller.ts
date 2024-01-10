import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { ApiV1 } from '@mush/core/utils'
import { ERole, EPermission } from '@mush/core/enums'

import { CategoryService } from './category.service'
import { Category } from './category.entity'
import { UpdateCategoryDto } from './dto'

@ApiTags('Categories')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('categories'))
export class CategoryController {
  constructor(readonly categoryService: CategoryService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CATEGORY,
  })
  @ApiOperation({
    summary:
      'Get list of all categories. Role: SUPERADMIN, ADMIN. Permission: READ_CATEGORY.',
  })
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Add a new category. Role: SUPERADMIN, ADMIN. Permission: CREATE_CATEGORY.',
  })
  @ApiBody({
    description: 'Model to add a new category.',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the category data.',
    type: Category,
  })
  async createCategory(@Body() data: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_CATEGORY,
  })
  @ApiOperation({
    summary:
      'Update a category. Role: SUPERADMIN, ADMIN. Permission: UPDATE_CATEGORY.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing category.',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the category data.',
    type: Category,
  })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_CATEGORY,
  })
  @ApiOperation({
    summary:
      'Remove a category. Role: SUPERADMIN, ADMIN. Permission: DELETE_CATEGORY.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeCategory(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.categoryService.removeCategory(id)
  }
}
