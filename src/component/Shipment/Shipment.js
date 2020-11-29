import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { userContext } from "../../App";
import './Shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [logegdInUser, setLoggedInUser] = useContext(userContext);
    const onSubmit = data => console.log(data);
  return (
      <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
        <input name="name" defaultValue={logegdInUser.name} ref={register({ required: true })} placeholder='Enter Full Name' />
        {errors.name && <span className='error'>Name is required</span>}
        <input name="email" defaultValue={logegdInUser.email} ref={register({ required: true })} placeholder='Enter Email Here' />
        {errors.email && <span className='error'>Email is required</span>}
        <input name="address" ref={register({ required: true })} placeholder='Enter Address Name'/>
        {errors.adress && <span className='error'>Adress is required</span>}
        <input name="phone" ref={register({ required: true })} placeholder='Enter Address Name'/>
        {errors.phone && <span className='error'>Phone is required</span>}
        <input type="submit" />
      </form>
  );
};

export default Shipment;
