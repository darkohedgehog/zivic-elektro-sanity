"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { useDispatch, useSelector } from "react-redux";
import { StateProps } from "../../type";
import CartItem from "./CartItem";
import { resetCart } from "@/redux/elektroSlice";
import toast from "react-hot-toast";
import emptyCart from "@/assets/emptyCart.png";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Price from "./Price";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const Cart = () => {
  const { productData } = useSelector((state: StateProps) => state.elektro);
  const dispatch = useDispatch();
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(4); // Postavi željeni iznos troškova dostave

  const { data: session } = useSession();

  const [paymentMethod, setPaymentMethod] = useState('card');

  const createOrder = async () => {
    try {
      const orderDetails = {
        _type: 'order',
        items: productData,
        totalAmount: totalAmt,
        shippingCharge: shippingCharge,
        paymentMethod: paymentMethod,
        userEmail: session?.user?.email, // Pretpostavka da korisnik ima sesiju
        // Dodajte bilo koje dodatne informacije koje su potrebne za narudžbinu
      };
  
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Narudžbina kreirana. Detalji: ${data.message}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Greška pri kreiranju narudžbine:", error);
    }
  };
  
  

  const handleCheckout = async () => {
    if (paymentMethod === 'card') {
      createCheckout(); // Vaša postojeća funkcija za Stripe Checkout
    } else {
      // Obrada narudžbine za gotovinsko plaćanje ili bankarsku transakciju
      createOrder(); // Funkcija za slanje narudžbine na server
    }
  };
  

{/* Kod za izračun popusta u košarici */}

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode === 'popust20') {
      setDiscount(0.20); // 20% popusta
    } else {
      toast.error("Neispravan kod kupona!");
      setDiscount(0); // Resetujte popust ako kod nije validan
    }
  };

  const discountedTotal = totalAmt - (totalAmt * discount);

{/* Izračun cijene proizvoda u košarici */}
  useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item?.price * item?.quantity;
      return price;
    });
    setTotalAmt(price); // Samo cijene proizvoda bez troškova dostave
}, [productData]);
  
{/* Reset košarice */}
  const handleReset = () => {
    const confirmed = window.confirm("Da li ste sigurni da želite isprazniti košaricu?");
    confirmed && dispatch(resetCart());
    toast.success("Košarica uspješno ispražnjena!");
  };

  // Stripe payment

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const createCheckout = async () => {
    if (session?.user) {
      const stripe = await stripePromise;
      const response = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: productData,
          email: session?.user?.email,
          shippingCharge: shippingCharge,
          discount: discount,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        stripe?.redirectToCheckout({ sessionId: data.id });
      }
    } else {
      toast.error("Molimo, prijavite se kako biste nastavili");
    }
  };

  return (
    <Container>
      {productData?.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#f5f7f7] text-primeColor hidden lg:grid grid-cols-5 place-content-center px-6 text-lg font-semibold">
            <h2 className="col-span-2">Proizvod</h2>
            <h2>Cijena</h2>
            <h2>Količina</h2>
            <h2>Ukupno</h2>
          </div>
          <div className="mt-5">
            {productData.map((item) => (
              <div key={item?._id}>
                <CartItem item={item} />
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Isprazni košaricu
          </button>
          <div className="flex flex-col md:flex-row justify-between border p-4 items-center gap-2 md:gap-0">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Broj kupona"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-44 lg:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
              />
              <button onClick={handleApplyCoupon} className="text-lg font-semibold">
            Primjeni kupon
          </button>
            </div>
            <p>Dodaj u košaricu</p>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Ukupno</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Međusuma{" "}
                  <span>
                    <Price amount={totalAmt} />
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Trošak dostave
                  <span className="font-semibold tracking-wide font-titleFont">
                    <Price amount={shippingCharge} />
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
            Ukupno
            <span className="font-bold tracking-wide text-lg font-titleFont">
              <Price amount={discountedTotal + shippingCharge} />
            </span>
          </p>
              </div>
          <div className="flex flex-col">
            <h4 className="my-4 flex mx-auto">Odaberite način plaćanja</h4>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mb-4 mx-2"
        >
          <option value="card">Plaćanje karticom</option>
          <option value="cash">Gotovinsko plaćanje prilikom preuzimanja</option>
          <option value="bank">Plaćanje direktnom bankarskom transakcijom</option>
        </select>
        <button
          onClick={handleCheckout}
          className="h-10 w-96 rounded-md bg-primeColor text-white hover:bg-black duration-300"
        >
          Plaćanje
        </button>
      </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <Image
              src={emptyCart}
              alt="emptyCart"
              className="w-80 rounded-lg p-4 mx-auto"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex flex-col gap-4 items-center rounded-md shadow-lg">
            <h1 className="text-xl font-bold uppercase">
              Vaša košarica je prazna.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Vaša košarica je tužna! Napunite je našim proizvodima i učinite je sretnom!
            </p>
            <Link
              href={"/"}
              className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-semibold text-lg text-gray-200 hover:text-white duration-300"
            >
              Nastavi kupovinu
            </Link>
          </div>
        </motion.div>
      )}
    </Container>
  );
};

export default Cart;