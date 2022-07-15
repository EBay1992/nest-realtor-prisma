// import { faker } from '@faker-js/faker';
// import { Home, PropertyType, User, UserType } from '@prisma/client';
// import { Exclude } from 'class-transformer';

// const randomInRange = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + Math.floor(min);

// const randomFromEnum = (enumType: any) => {
//   const keys = Object.keys(enumType);
//   return enumType[keys[(keys.length * Math.random()) << 0]];
// };

// enum Gender {
//   male = 'male',
//   female = 'female',
// }

// const createRealtorDummyData = () => {
//   const User: Partial<User> = {
//     name: faker.name.findName(undefined, undefined, randomFromEnum(Gender)),
//     phone: faker.phone.number(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//     user_Type: randomFromEnum(Omit<UserType, 'ADMIN'>),
//   };

//   return User;
// };

// const createHomeDummyData = () => {
//   const home: Partial<Home> = {
//     land_size: randomInRange(100, 1000),
//     address: faker.address.streetAddress(),
//     city: faker.address.city(),
//     listed_date: faker.date.recent(),
//     price: Math.round(
//       +faker.finance.amount(100, 1000) * randomInRange(100, 1000),
//     ),
//     realtor_id: randomInRange(1, 10),
//     number_of_bathroom: randomInRange(0, 10),
//     number_of_rooms: randomInRange(0, 10),
//     propertyType: randomFromEnum(PropertyType),
//   };

//   return home;
// };

// console.log(createHomeDummyData());
// console.log(createRealtorDummyData());
// //     homes.push();
// //   }
// // };
