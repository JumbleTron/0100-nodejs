import ejs from 'ejs';
import fs from 'fs';

const products = [
  {
    id: 1,
    name: 'Product name',
    description: 'Product dsc',
    price: 1200,
  },
  {
    id: 2,
    name: 'Product name 2',
    description: 'Product dsc 2',
    price: 2000,
  },
];

export const productsGet = (req, res) => {
  const htmlContent = fs.readFileSync('views/index.ejs', 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const template = ejs.compile(htmlContent, { views: ['views'] });
  res.end(template({ userName: 12, products }));
};

export const productGet = (req, res, objectId) => {
  const htmlContent = fs.readFileSync('views/entity.ejs', 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const template = ejs.compile(htmlContent, { views: ['views'] });
  res.end(template({ userName: 'Krzyś', productId: objectId }));
};
