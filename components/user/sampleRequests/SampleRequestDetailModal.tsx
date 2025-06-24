import LabelValueVertical from "@/components/shared/LabelValueVertical";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserInfo } from "@/lib/useUserInfo";
import { Eye, Pencil } from "lucide-react";
import React from "react";

interface SampleRequestDetailModalProps {
  mode?: "view" | "edit";
  requestDetails?: {
    address: string;
    application: string;
    city: string;
    country: string;
    createdAt: Date;
    expected_annual_volume: number;
    forFree?: boolean;
    grade: {
      name: string;
    }
    message: string;
    neededBy: Date;
    orderDate: Date;
    postCode: string;
    product: {
      productName: string;
      createdBy: {
        company: string;
      };
    };
    quantity: number;
    status: string;
    uom: string;
    user: {
      name: string;
      email: string;
    }
  };
}

const SampleRequestDetailModal: React.FC<SampleRequestDetailModalProps> = ({
  mode = "view",
  requestDetails,
}) => {
  console.log("Request Details:", requestDetails);
  const { user } = useUserInfo();
  console.log("User Info:", user);
  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted");
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {mode === "view" ? (
            <button type="button">
              <Eye
                size={20}
                strokeWidth={2}
                className="cursor-pointer text-[var(--green-main)] hover:text-[var(--green-dark)]"
              />
            </button>
          ) : (
            <button type="button">
              <Pencil
                size={20}
                strokeWidth={2}
                className="cursor-pointer text-[var(--green-main)] hover:text-[var(--green-dark)]"
              />
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="w-full max-w-[90vw] md:max-w-4xl ">
          <DialogHeader>
            <DialogTitle className="capitalize"> {mode} Request</DialogTitle>
            <DialogDescription>
              {mode === "view"
                ? "View the details of this sample request, including product information and request status."
                : "Edit the details of this sample request. Make changes as needed and click Save to update the request."}
            </DialogDescription>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <LabelValueVertical
                label="Product Name"
                value={requestDetails?.product?.productName || "--"}
              />
              <LabelValueVertical
                label="Company Name"
                value={requestDetails?.product?.createdBy?.company || "--"}
              />
              <LabelValueVertical
                label="Quantity"
                value={requestDetails?.quantity || "--"}
              />
              {
                user?.user_type === "buyer" ?
                  <LabelValueVertical
                    label="User"
                    value={requestDetails?.user?.name || "--"}
                  /> : null

              }
              {
                user?.user_type === "buyer" ?
                  <LabelValueVertical
                    label="Email"
                    value={requestDetails?.user?.email || "--"}
                  /> : null
              }

            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"outline"}
                className="border cursor-pointer border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition hover:text-[var(--green-main)]"
              >
                Cancel
              </Button>
            </DialogClose>
            {mode === "edit" && (
              <Button
                type="submit"
                onClick={handleSubmit}
                variant={"default"}
                className="bg-gradient-to-r cursor-pointer from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90"
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleRequestDetailModal;
