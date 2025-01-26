'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from 'yup';
import { useState } from 'react';
import { toast } from 'sonner';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { studentFeesSchema, studentFeesSearchSchema } from '@/schema';
import {
  PaymentMode,
  useCreateStudentFeeMutation,
  useLazyGetLatestStudentFeeQuery,
  useLazyGetStudentByIdQuery,
} from '@/store/api';
import { StudentData } from '@/types';
import DatePicker from '@/components/shared/date-picker';

type SemesterType = { value: string; label: number }[];

const Page = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [semesters, setSemesters] = useState<SemesterType>([]);

  const [searchStudent, { isLoading: isSearching }] = useLazyGetStudentByIdQuery();
  const [latestStudentFee, { isLoading: isFetchingLatestFee }] = useLazyGetLatestStudentFeeQuery();
  const [createStudentFee, { isLoading: isCreatingFee }] = useCreateStudentFeeMutation();

  // Student search form
  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors },
    reset: searchReset,
  } = useForm<InferType<typeof studentFeesSearchSchema>>({
    resolver: yupResolver(studentFeesSearchSchema),
  });

  // Fee submission form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset: feeReset,
  } = useForm<InferType<typeof studentFeesSchema>>({
    resolver: yupResolver(studentFeesSchema),
  });

  const semester = watch('semester');
  const modeOfPayment = watch('modeOfPayment');

  const onFeesSubmit = async (data: InferType<typeof studentFeesSchema>) => {
    if (!student) return;
  
    try {
      const response = await createStudentFee({
        student: student._id,
        ...data,
        payDate: data.payDate.toISOString(),
      }).unwrap(); // Use `unwrap()` to directly get the response or throw an error.
  
      if (response?.success) {
        toast.success('Student fees added successfully');
        feeReset();
        searchReset();
      }
    } catch (error: any) {
      // Handle backend errors
      const errorMessage = error?.data?.message || 'Failed to add student fee';
      toast.error(errorMessage);
    }
  };
  

  const onSearchSubmit = async (data: InferType<typeof studentFeesSearchSchema>) => {
    try {
      const response = await searchStudent(data.registerationNumber).unwrap();
      if (response.success && response.data) {
        toast.success('Student found!');
        setStudent(response.data);

        const semesterOptions = response.data.course.semesters.map((semester) => ({
          label: semester.semesterNumber,
          value: semester._id,
        }));
        setSemesters(semesterOptions);

        setValue('course', response.data.course.name);
        setValue('session', response.data.session);
      } else {
        throw new Error('Student not found');
      }
    } catch {
      toast.error('Error while searching student');
    }
  };

  const handleSemesterChange = async (e) => {
    const selectedSemester = e.target.value as string;
    setValue('semester', selectedSemester);

    if (student) {
      try {
        const response = await latestStudentFee({ semester: selectedSemester, student: student._id }).unwrap();
        if (response.success && response.data) {
          toast.success('Latest Fee found!');
          setValue('balanceFees', response.data.balanceFees);
          setValue('discount', response.data.totalDiscount);
          setValue('totalFees', response.data.totalFees);
        } else {
          throw new Error('Latest Fee not found');
        }
      } catch {
        toast.error('Error while fetching latest fee details');
      }
    }
  };

  return (
    <section className="py-5 px-2">
      <h1 className="font-bold text-xl">Student Fee</h1>

      <div className="border border-gray-300 bg-white p-4">
        <form onSubmit={handleSearchSubmit(onSearchSubmit)} className="flex flex-col space-y-4">
          <div className="mb-4">
            <h2 className="font-bold text-base">SEARCH</h2>
            <div className='border border-gray-900 rounded-md p-1'>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Registration Number"
                  register={searchRegister("registerationNumber")}
                  error={!!searchErrors.registerationNumber}
                  message={searchErrors.registerationNumber?.message}
                  
                />
              </div>
              <div className="flex space-x-2 mt-4 w-full justify-start">
                <Button
                  title="Search"
                  loadingTitle="searching..."
                  type='submit'
                  className="w-fit"
                  isLoading={isSearching}
                />

                <Button
                  title="Cancel"
                  onClick={() => {searchReset(); feeReset(); }}
                  type='button'
                  className="w-fit"
                />
              </div>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit(onFeesSubmit)} className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
                  label='Course'
              register={register('course')}
              disabled
              placeholder="Auto Filled through Registration Form"
              error={!!errors.course}
              message={errors.course?.message}
            />
          </div>
          <div>
            <Input
              type="number"
                  label='Session/Year'
              register={register('session')}
              disabled
              placeholder="Auto Filled through Registration Form"
              error={!!errors.session}
              message={errors.session?.message}
            />
          </div>
          <div>
          <FormControl
                variant="standard"
                fullWidth
              >
                <InputLabel id="semester" className="text-[12px]">
                  Semester
                </InputLabel>
              <Select
                value={semester}
                labelId="semester"
                disabled={!student}
                {...register('semester')}
                onChange={handleSemesterChange}
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem.value} value={sem.value}>
                    {sem.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.semester && <small className="text-red-500">{errors.semester.message}</small>}
            </FormControl>
          </div>
          <div>
            <Input
              type="number"
                  label='Discount'
              register={register('discount')}
              disabled
              placeholder="Auto Filled through Registration Form"
              error={!!errors.discount}
              message={errors.discount?.message}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Total Fees"
              register={register('totalFees')}
              disabled
              placeholder="Auto Filled through Registration Form"
              error={!!errors.totalFees}
              message={errors.totalFees?.message}
            />
            </div>
                  <div>
                <DatePicker
                  label="Paid on Date"
                  register={register("payDate")}
                  error={!!errors?.payDate}
                  message={errors.payDate?.message}
                />
              </div>
              <div>
            <Input
              type="number"
              label="Balance Fees"
              register={register('balanceFees')}
              disabled
              placeholder="Auto Filled through Registration Form"
              error={!!errors.balanceFees}
              message={errors.balanceFees?.message}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Pay Amount"
              register={register('paidAmount')}
              disabled={!student}
              placeholder="Pay fees"
              error={!!errors.paidAmount}
              message={errors.paidAmount?.message}
            />
          </div>
          <div>
          <FormControl
                variant="standard"
                fullWidth
              >
                <InputLabel id="semester" className="text-[12px]">
                  Mode of Payment
                </InputLabel>
              <Select
                value={modeOfPayment}
                labelId="modeOfPayment"
                disabled={!student}
                {...register('modeOfPayment')}
              >
                {Object.values(PaymentMode).map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </Select>
              {errors.modeOfPayment && <small className="text-red-500">{errors.modeOfPayment.message}</small>}
            </FormControl>
          </div>
    
          {
            (modeOfPayment === PaymentMode.ONLINE_TRANSFER) && 
            <div>
              <Input
                type="text"
                  label='Transaction ID'
                disabled={!student}
                  register={register('transactionId')}
                  placeholder="Transaction ID"
                error={!!errors.transactionId}
                message={errors.transactionId?.message}
              />
          </div>
          }
        </div>
      
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              title="Submit"
              loadingTitle="Submitting..."
              type="submit"
              isLoading={isFetchingLatestFee || isCreatingFee}
              isDisable={!student || !semester}
            />
            <Button title="Cancel" type="button" className="w-fit bg-[#cccccc]" onClick={() => feeReset()} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
