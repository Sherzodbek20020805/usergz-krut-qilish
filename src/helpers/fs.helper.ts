import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';

@Injectable()
export class FsHelper {
  async uploadFile(file: Express.Multer.File) {
    const fileFolder = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(fileFolder)) {
      fs.mkdirSync(fileFolder, { recursive: true });
    }

    let fileName = `${Date.now()}-file.${file.originalname.split('.')[1]}`;

    await fsPromises.writeFile(path.join(fileFolder, fileName), file.buffer);

    return {
      message: 'success',
      fileUrl: fileName,
    };
  }

  async removeFiles(fileName: string | string[]) {
    let files = [];
    if (typeof fileName == 'string') {
      files.push(fileName);
    } else {
      files = [...fileName];
    }

    for (let file of files) {
      const filePath = path.join(process.cwd(), 'uploads', file);
      if (!fs.existsSync(filePath)) continue;
      else {
        fs.unlink(filePath, () => undefined);
      }
    }

    return {
      message: "O'chirildi",
    };
  }
}
