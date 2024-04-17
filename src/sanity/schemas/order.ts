import { defineField, defineType } from "sanity";

export default defineType({
  name: 'order',
  type: 'document',
  title: 'Order',
  fields: [
    {
      name: 'customer',
      type: 'reference',
      to: [{type: 'customer'}],
      title: 'Customer'
    },
    {
      name: 'products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      title: 'Products'
    },
    {
      name: 'total',
      type: 'number',
      title: 'Total Amount'
    },
    {
      name: 'paymentMethod',
      type: 'string',
      title: 'Payment Method',
      options: {
        list: [
          {title: 'Stripe', value: 'stripe'},
          {title: 'Cash on Delivery', value: 'cashOnDelivery'},
          {title: 'Direct Bank Transfer', value: 'directBankTransfer'}
        ],
      },
    },
    {
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Paid', value: 'paid'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'}
        ],
      },
    },
    {
      name: 'orderDate',
      type: 'datetime',
      title: 'Order Date'
    },
  ]
});