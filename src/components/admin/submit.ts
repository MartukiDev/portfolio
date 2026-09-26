import { startTransition, type FormEvent } from "react";

/**
 * onSubmit que envía el FormData a la acción de useActionState sin el reseteo
 * automático de React 19 (que borraría lo escrito si hay errores).
 */
export function submitWithoutReset(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
}
