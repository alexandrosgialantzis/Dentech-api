export const populateProducts = [
  {
    path: 'orders',
    select: '_id totalCost paid unPaid takenDate sendDate',
  },
  {
    path: 'createdBy',
    select: 'fullName email cellPhone _id',
  },
];

export const populateOrders = [
  {
    path: 'products.id',
    select: '_id name price',
  },
  {
    path: 'createdBy',
    select: 'fullName email telephone cellPhone _id',
  },
  {
    path: 'dentist',
    select: 'fullName email telephone cellPhone _id',
  },
];

export const populateCredits = [
  {
    path: 'order',
    select: '_id totalCost paid unPaid takenDate sendDate',
  },
  {
    path: 'createdBy',
    select: 'fullName email telephone cellPhone _id',
  },
  {
    path: 'dentist',
    select: 'fullName email telephone cellPhone _id',
  },
];
