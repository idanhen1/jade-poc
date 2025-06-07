import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Drawer = React.forwardRef(({ open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" {...props} ref={ref}>
      {children}
    </div>
  );
});
Drawer.displayName = "Drawer";

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </div>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props} 
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} 
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} 
  />
));
DrawerDescription.displayName = "DrawerDescription";

const DrawerClose = ({ asChild, children, onClick, ...props }) => {
  const Comp = asChild ? React.Fragment : Button;
  const childProps = asChild ? {} : { variant: "outline", ...props };
  
  return (
    <Comp {...childProps}>
      {children || <X />}
    </Comp>
  );
};
DrawerClose.displayName = "DrawerClose";

export {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
};

export default Drawer;