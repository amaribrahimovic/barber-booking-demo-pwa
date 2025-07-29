import { Input } from "@mui/joy";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { useEffect, useState } from "react";

const CustomerAutocomplete = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/customers`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.data;
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filterCustomers = (term) => {
    if (!term) {
      setFilteredCustomers([]);
      return;
    }
    const lowerCaseTerm = term.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(lowerCaseTerm) ||
        customer.phoneNumber.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers(searchTerm);
  }, [searchTerm]);

  return (
    <div className="w-full">
      {!selectedCustomer && (
        <Input
          id="customer-search"
          placeholder="Išči stranko..."
          type="search"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: "#121212",
            color: "#fff",
            borderColor: "#1f7a1f",
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            "& .MuiInputBase-root": {
              borderRadius: 2,
              borderColor: "#1f7a1f",
            },
          }}
        />
      )}

      {filteredCustomers.length > 0 && !selectedCustomer && (
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#121212",
            border: "1px solid #1f7a1f",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        >
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => {
                setSelectedCustomer(customer);
                onSelect(customer);
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                color: "#fff",
                borderBottom: "1px solid #1f7a1f",
              }}
            >
              {customer.fullName} - {customer.phoneNumber}
            </div>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <div className="flex items-center justify-between p-2 mt-2 rounded-sm bg-gray-800">
          <p>
            <strong>
              {" "}
              {selectedCustomer.fullName} - {selectedCustomer.phoneNumber}
            </strong>
          </p>

          <button
            onClick={() => {
              setSelectedCustomer(null);
              setSearchTerm("");
              setFilteredCustomers([]);
              onSelect(null);
            }}
            className="bg-red-600 text-white rounded hover:bg-red-700"
          >
            <ClearIcon sx={{ color: "#fff" }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerAutocomplete;
