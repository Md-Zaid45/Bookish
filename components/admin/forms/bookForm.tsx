"use client";
import ImageUpload from "@/components/imageUpload";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import ColorPicker from "../colorPicker";
import createBook from "@/lib/admin/actions/book";

interface Props extends Partial<Book> {
  type?: "create" | "update";
}

const BookForm = ({ type }: Props) => {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      decription: "",
      author: "",
      genre: "",
      ratings: 1,
      totalCopies: 0,
      coverUrl: "",
      coverColor: "",
      videoUrl: "",
      summary: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const res=await createBook(values)
  };
  return (
    <div className="">
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Book title
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Book Title"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="author"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Author
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Book Author"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Description
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  placeholder="Enter the description of the book"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="genre"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Genre
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  placeholder="Book genre"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="ratings"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Ratings
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  min={1}
                  max={5}
                  placeholder="Book ratings"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="totalCopies"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Total Copies
                </FieldLabel>

                <Input
                  className="book-form_input"
                  required
                  {...field}
                  min={1}
                  max={5}
                  placeholder="Total no of copies available"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="coverUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Uplade the book cover image
                </FieldLabel>

                <ImageUpload
                  type="file"
                  placeholder="Uplade the book cover image"
                  accept="image/*"
                  onFileUplload={field.onChange}
                  variant="light"
                />

                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="coverColor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Cover color
                </FieldLabel>

                <ColorPicker value={field.value} onPickerChnage={field.onChange}/>
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="videoUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Upload book trailer video
                </FieldLabel>

                <ImageUpload
                  type="file"
                  accept="video/*"
                  placeholder="Upload book trailer video"
                  variant="light"
                  onFileUplload={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="summary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-normal text-dark-500">
                  Book Summary
                </FieldLabel>
                <Textarea
                  className="book-form_input"
                  required
                  rows={10}
                  {...field}
                  placeholder="Enter the summary of the book"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError
                    className="font-semibold text-xs "
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" className="mt-5 text-white book-form_btn bg-">
          Add book to Library
        </Button>
      </form>
    </div>
  );
};

export default BookForm;
