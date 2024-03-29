import { useState, useEffect } from "react";

const MyForm = () => {
  const [formData, setFormData] = useState({
    tenant_name: "",
    room_no: "",
    mobile_number: "",
    aadhaar: "",
    joined_date: "",
    tenant_status: "Active",
    security_deposit_amount: "2000",
    security_deposit_status: "Paid",
    rent_amount: "",
  });

  const [formArray, setFormArray] = useState(() => {
    // Retrieve existing data from local storage or initialize as an empty array
    const storedData = JSON.parse(localStorage.getItem("formArray")) || [];
    return storedData;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_number" && value.length > 10) {
      alert("Please enter a valid phone number");
      return;
    }
    if (name === "aadhaar" && value.length > 12) {
      alert("Please enter a valid aadhaar number");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  //remove all elements in the local storage
  const removeFromLocalStorage = () => {
    setFormArray([]);
    localStorage.clear("formArray");
  };

  const handleWheel = (e) => {
    const activeElement = document.activeElement;

    // Check if the active element is a number input
    if (activeElement && activeElement.type === "number") {
      e.preventDefault();
    }
  };

  // Attach the wheel event listener to the document
  useEffect(() => {
    document.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  // delete an item from the array
  const handleDelete = (id) => {
    // Filter out the item with the specified id
    const newArray = formArray.filter((item) => item.id !== id);

    // Update state and local storage
    setFormArray(newArray);
    localStorage.setItem("formArray", JSON.stringify(newArray));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const fieldValues = Object.values(formData);
    // console.log(formData);
    // fieldValues.forEach((value) => {
    //   console.log(typeof value);
    // });

    // Check if all fields are filled
    const areAllFieldsFilled = Object.values(formData).every(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (areAllFieldsFilled) {
      // All fields are filled, proceed with form submission logic

      // Combine form data into an object along with an id which is the date-time
      const newFormData = { ...formData, id: new Date().toISOString() };

      //Insert Your API request here
      const URL = import.meta.env.API_URL;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };

      // try {
      //   const response = await fetch(URL, options);
      //   if (response.ok) {
      //     console.log("Form data sent successfully.");
      //   } else {
      //     console.error("Failed to send form data.");
      //   }
      // } catch (error) {
      //   console.error("Error sending form data:", error);
      // }

      // Add the new object at the beginning of the array using unshift
      const newArray = [newFormData, ...formArray];

      // Update state and local storage
      setFormArray(newArray);
      localStorage.setItem("formArray", JSON.stringify(newArray));

      // Reset form data for the next entry
      setFormData({
        tenant_name: "",
        room_no: "",
        mobile_number: "",
        aadhaar: "",
        joined_date: "",
        tenant_status: "Active",
        security_deposit_amount: "2000",
        security_deposit_status: "Paid",
        rent_amount: "",
      });
    } else {
      // Fields are not filled, display an error message or take appropriate action
      alert("Please fill in all fields before submitting.");
    }
  };

  return (
    <div className="h-full grid grid-cols-2 justify-start items-start px-4 py-14 relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center sticky w-[90%] max-w-[1024px] px-8 py-2 border border-gray-700 rounded-md"
      >
        <h1 className="font-semibold m-2 text-center text-gray-900">
          Add Tenant Details
        </h1>
        {/* Render your form fields with associated names and onChange handlers */}
        {/* First row */}
        <div className="grid grid-cols-2 mb-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm mb-2">Tenant Name:</label>
            <input
              type="text"
              name="tenant_name"
              value={formData.tenant_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Tenant Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Room No:</label>
            <input
              type="number"
              name="room_no"
              value={formData.room_no}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Room No"
            />
          </div>
        </div>
        {/* Second row */}
        <div className="grid grid-cols-2 mb-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm mb-2">Mobile Number:</label>
            <input
              type="number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Mobile Number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Aadhaar No:</label>
            <input
              type="number"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Aadhaar No"
            />
          </div>
        </div>
        {/* Third row */}
        <div className="grid grid-cols-2 mb-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm mb-2">Joined Date:</label>
            <input
              type="date"
              name="joined_date"
              value={formData.joined_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Joined Date"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Tenant Status:</label>
            <select
              name="tenant_status"
              value={formData.tenant_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        {/* Fourth row */}
        <div className="grid grid-cols-2 mb-2 gap-6">
          <div className="mb-6">
            <label className="block text-sm mb-2">
              Security Deposit Amount(INR):
            </label>
            <select
              name="security_deposit_amount"
              value={formData.security_deposit_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
            >
              <option value="2000">2000</option>
              <option value="3000">3000</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">
              Security Deposit Status:
            </label>
            <select
              name="security_deposit_status"
              value={formData.security_deposit_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        {/* Fifth Row */}
        <div className="grid grid-cols-2 mb-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm mb-2">Rent Amount:</label>
            <input
              type="number"
              name="rent_amount"
              value={formData.rent_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              placeholder="Enter Rent Amount"
            />
          </div>
        </div>
        {/* Submit  Button */}
        <div className="text-center">
          <button
            className="py-3 px-6 bg-slate-600 text-yellow-100 rounded-md"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Second Column */}
      <div className="h-full">
        <div className="flex justify-start">
          <p className="my-2 mr-10">Total tenants: {formArray.length}</p>

          <button
            className="py-2 px-3 m-2 mr-6 bg-slate-600 text-red-300 rounded-md"
            type="button"
            onClick={removeFromLocalStorage}
          >
            Remove Data
          </button>
        </div>
        {/* Display the submitted data */}
        <ul className="pb-4 mb-4">
          {formArray.length === 0 && (
            <p className="mt-4 text-red-500 text-center">
              Tenants data is not available. Please populate the data.
            </p>
          )}
          {formArray.map((data, index) => (
            <li key={index} className="flex border rounded px-4 py-2 mb-2">
              <div className="w-[92%] grid grid-cols-2">
                {Object.entries(data).map(([field, value]) => (
                  <div
                    key={field}
                    className={`flex mb-1 ${field === "id" ? "hidden" : ""}`}
                  >
                    <span className="font-medium text-sm mr-2">{field}:</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <button
                  className=" px-2 py-1 text-xs rounded bg-red-400 "
                  type="button"
                  onClick={() => handleDelete(data.id)}
                >
                  remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyForm;
