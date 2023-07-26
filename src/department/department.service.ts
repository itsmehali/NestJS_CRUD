import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

interface DepartmentResponse {
  message: string;
  error?: Error;
}

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponse> {
    const { departments } = createDepartmentDto;

    try {
      for (const departmentData of departments) {
        const department = await this.departmentRepository.save({
          name: departmentData.name,
        });
        console.log('department:', department);

        for (const userData of departmentData.users) {
          await this.userRepository.save({
            ...userData,
            department,
          });
          console.log('userData:', userData);

          // department: { name: '1. osztály', id: 17 }
          // userData: { name: 'Kis József', birthday: '1950-12-12' }
          // userData: { name: 'Nagy Katalin', birthday: '1920-02-12' }
          // department: { name: '2. osztály', id: 18 }
          // userData: { name: 'Nagy József', birthday: '1953-10-11' }
          // userData: { name: 'Kis Katalin', birthday: '1925-02-22' }
        }
      }

      return { message: 'Departments and users created successfully' };
    } catch (error) {
      console.error('Error while creating departments and users:', error);
      return {
        message: 'An error occurred while creating departments and users',
        error,
      };
    }
  }

  findAll() {
    return this.departmentRepository.find();
  }

  findAllWithUsers() {
    return this.departmentRepository.find({
      relations: ['users'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponse> {
    const queryRunner =
      this.departmentRepository.manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      // First department name
      await queryRunner.query(`UPDATE department SET name = $1 WHERE id = $2`, [
        updateDepartmentDto.name,
        id,
      ]);

      // Then users if they exists
      if (updateDepartmentDto.users && updateDepartmentDto.users.length > 0) {
        for (const user of updateDepartmentDto.users) {
          await queryRunner.query(
            `UPDATE users SET name = $1, birthday = $2 WHERE id = $3`,
            [user.name, user.birthday, user.id],
          );
        }
      }

      await queryRunner.commitTransaction();

      return { message: 'Department updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<DepartmentResponse> {
    try {
      const result = await this.departmentRepository.delete(id);
      return { message: 'Department deleted succesfully' };
    } catch (error) {
      return { message: 'Error while deleting department', error };
    }
  }
}
