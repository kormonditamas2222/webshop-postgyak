import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';

const mySqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "orders"
})

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async ujRendeles(product: string, customerName: string, billingAddress: string, shippingAddress: string) {
    await mySqlConnection.execute("INSERT INTO orders (product, customerName, billingAddress, shippingAddress) VALUES (?,?,?,?)", [product, customerName, billingAddress, shippingAddress]);
  }
}
