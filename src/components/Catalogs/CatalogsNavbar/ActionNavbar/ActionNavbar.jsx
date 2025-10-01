import * as React from "react";
import classNames from "classnames";
import { Accordion } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { CartContext } from "../../../../Context/CartContext";

export default function ActionNavbar() {

  const { CatalogsId } = useParams();
  let token = localStorage.getItem("userToken");
  
  // Get selected basket from context
  const { selectedBasket } = useContext(CartContext);

  const [selectedTemplate, setSelectedTemplate] = React.useState("");

  // Get all templates
  function getAllTemplate() {
    return axios.get(`${API_BASE_URL}templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data } = useQuery({
    queryKey: ["AllTemplate"],
    queryFn: getAllTemplate,
    select: (data) => {
      const allTemplate = data.data.templates;
      return allTemplate.filter((template) => template.status === 1)
    },
  });

  // Generate catalog
  function handleViewCatalog() {
    
    if (!selectedTemplate) {
      toast.error("Please select a template!");
      return;
    }

    if (!selectedBasket) {
      toast.error("Please select a basket!");
      return;
    }

    let body = {
      template_id: selectedTemplate,
      basket_id: selectedBasket.id,
    };

    return axios
      .post(`${API_BASE_URL}catalogs/generate`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Catalog Generated Successfully");
        const fileUrl = res.data.file_url.startsWith("http")
          ? res.data.file_url
          : `http://127.0.0.1:8000/api${res.data.file_url}`;
        window.open(fileUrl, "_blank");
      })
      .catch((err) => {
        toast.error("Failed to Generate Catalog");
        console.log(err);
      });
  }

  // Convert catalog to basket
  function convertCatalogToBasket() {
    if (!CatalogsId) {
      toast.error("No Catalog ID found!");
      return;
    }
    axios
      .post(
        `${API_BASE_URL}catalogs/${CatalogsId}/revert`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Products returned to basket successfully!");
      })
      .catch(() => {
        toast.error("Failed to return products to basket.");
      });
  }

  return (
    <>
      <Accordion.Root
        className="w-[96.5%] mx-auto mt-4 rounded-md bg-white textColor"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Action</AccordionTrigger>
          <AccordionContent>
            <div>
              <div className="w-[90%] mx-auto textColor h-[140px]">
                <select
                  className="w-[48%] border rounded-md p-2 me-5 mt-4"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Select Template</option>
                  {data?.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>

                <select
                  name=""
                  id=""
                  className="w-[48%] border rounded-md p-2"
                >
                  <option value="">Select Languages</option>
                </select>

                <div className="mt-8 flex justify-end gap-4 me-5">
                  <button
                    onClick={handleViewCatalog}
                    className="cursor-pointer bg-white textColor py-2 px-8 rounded-md border hover:text-white! hover:bg-[#1243AF]! duration-300 transition-all"
                  >
                    View Catalog as PDF
                  </button>

                  <button
                    onClick={convertCatalogToBasket}
                    className="text-red-600 flex gap-2 items-center bg-white py-2 cursor-pointer px-8 rounded-md hover:text-white hover:bg-red-600 border duration-300 transition-all"
                  >
                    Convert to Basket <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion.Root>
    </>
  );
}

const AccordionItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        "mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={classNames(
          "group flex h-[45px] flex-1 cursor-default items-center justify-between bg-mauve1 px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        "overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-[15px]">{children}</div>
    </Accordion.Content>
  )
);
