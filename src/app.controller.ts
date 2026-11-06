import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { OrderDto } from './order.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getWebshop() {
    return {

    }
  }

  @Post()
  @Render('index')
  order(@Body() body: OrderDto) {
    const nameRegex = /^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+ [A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+$/;
    const addressRegex = /^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+ [\d]{4} [A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ\.]+ [a-záéíóöőúüű]+ [\d\/A-Z]+$/;
    const phoneRegex = /^\+36[\d]{1,2}[\d]{7}$/;
    const couponRegex = /^[A-Z]{2}-[\d]{4}$/;
    const cardNumberRegex = /^[\d]{4}-[\d]{4}-[\d]{4}-[\d]{4}$/;
    const expirationRegex = /^(01|02|03|04|05|06|07|08|09|10|11|12)\/[\d]{2}$/;
    const CVCRegex = /^[\d]{3}$/;

    let errors: string[] = [];
    if (!body.product) {
      errors.push("Nincs kiválaszott termék")
    }
    if (!nameRegex.test(body.name)) {
      errors.push("Hibásan adta meg a nevet (2 rész *elnézést a többneves emberektől*, nagybetű)!")
    }
    if (!addressRegex.test(body.billingAddress)) {
      errors.push("Számlázási cím nem egyezik meg a cím formátumnak!")
    }
    if (!addressRegex.test(body.shippingAddress)) {
      errors.push("Szállítási cím nem egyezik meg a cím formátumnak!")
    }
    if (!phoneRegex.test(body.phoneNumber)) {
      errors.push("A telefonszám nem magyar vagy nem érvényes formátumú!")
    }
    if (body.couponCode != "" && !couponRegex.test(body.couponCode)) {
      errors.push("Elfogadott kuponkód XY-1234 formátmú!")
    }
    if (!cardNumberRegex.test(body.cardNumber)) {
      errors.push("A bankkártya szám helytelen!")
    }
    const ma = new Date();
    if (!expirationRegex.test(body.expirationDate)) {
      errors.push("Lejárati dátum formátuma helytelen")
    }
    else {
      const expiration = body.expirationDate.split("/")
      if (parseInt(expiration[1]) < parseInt(ma.getFullYear().toString().slice(2))) {
        errors.push("A kártya lejárt.")
      }
      else if (parseInt(expiration[0]) < ma.getMonth() + 1) {
        errors.push("A kártya lejárt.")
      }
    }
    if (!CVCRegex.test(body.CVC)) {
      errors.push("Helytelen biztonsági kód formátum.")
    }
    if (errors.length > 0) {
      return {
        errors,
        name: body.name, billingAddress: body.billingAddress, shippingAddress: body.shippingAddress,
        phoneNumber: body.phoneNumber, couponCode: body.couponCode
      }
    }
  }
}
