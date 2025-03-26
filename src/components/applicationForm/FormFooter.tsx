import { Step } from "./ApplicationForm";
import { useFormContextValues } from "@/hooks/useFormContextValues";
import { useFormContext } from "react-hook-form";
import { FormSchemaType } from "@/schema/schema";
import { Button } from "../ui/button";


const FormFooter = ({ steps }: { steps: Step[] }) => {
  const { trigger,  } = useFormContext<FormSchemaType>();

  const {
    handleNext,
    handlePrevious,
    hasNextPage,
    hasPreviousPage,
    isFinalPage,
    currentPageIndex
  } = useFormContextValues();

  if (isFinalPage) {
    return (
      <div className="flex justify-between w-full px-2">
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
        >
          back
        </Button>
        <Button type="submit">submit</Button>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-between px-7">
    <Button onClick={handlePrevious} type="button" disabled={!hasPreviousPage}>
      Back
    </Button>
    <Button
      onClick={async () => {
        const res = await trigger(steps[currentPageIndex].inputs, {
          shouldFocus: true,
        });
        if (!res) {
          return;
        }
        handleNext();
      }}
      type="button"
      disabled={!hasNextPage}
    >
      Next
    </Button>
  </div>
  );
};

export default FormFooter;
