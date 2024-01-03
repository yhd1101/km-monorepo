import { BeforeInsert, Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Provider } from './provider.enum';
@Entity()
export class User extends CommonEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL, //선택이 없으면 자동으로 이메일로 선택
  })
  public provider: Provider; //Provider에있는 4개중에 하나만 골라야함

  @Column({ nullable: true })
  public profileImg?: string;

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        //패스워드 암호화
        const saltValue = await bcrypt.genSalt(10); //암호화되는 키값
        this.password = await bcrypt.hash(this.password, saltValue);

        //프로필 이미지 자동생성
        this.profileImg = await gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
  async validatePassword(aPassword: string) {
    try {
      const isPasswordMatch = await bcrypt.compare(aPassword, this.password);
      return isPasswordMatch;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }
}
