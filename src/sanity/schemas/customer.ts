import { defineType } from "sanity";


export default defineType ({
    name: 'customer',
  type: 'document',
  title: 'Customer',
  fields: [
    {
      name: 'firstName',
      type: 'string',
      title: 'First Name'
    },
    {
      name: 'lastName',
      type: 'string',
      title: 'Last Name'
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email'
    },
    {
      name: 'phone',
      type: 'string',
      title: 'Phone'
    },
    {
      name: 'address',
      type: 'string',
      title: 'Address'
    },
    {
      name: 'orders',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'order'}]}],
      title: 'Orders'
    }
  ]
})
  
  