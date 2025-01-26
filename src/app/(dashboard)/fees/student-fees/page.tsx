'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from 'yup';
import Button from '@/components/shared/button';
import { studentFeesSchema, studentFeesSearchSchema } from '@/schema';
import Input from '@/components/shared/input';
import { PaymentMode, useCreateStudentFeeMutation, useLazyGetLatestStudentFeeQuery, useLazyGetStudentByIdQuery } from '@/store/api';
import { toast } from 'sonner';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { StudentData } from '@/types';
import { Module } from 'node:vm';


type SemesterType = {
  value: string;
  label: number;
}[];
const Page = () => {
  const [searchStudent, {isLoading}] = useLazyGetStudentByIdQuery();
  const [latestStudentFee, {isLoading: latestFeeLoading}] = useLazyGetLatestStudentFeeQuery();
  const [createStudentFee, { isLoading: createStudentFeeLoading }] = useCreateStudentFeeMutation();
  const [student, setStudent] = useState<StudentData | null>(null);
const [semesters, setSemesters] = useState<SemesterType>([]);

  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors },
    reset: searchReset,
    watch: searchWatch
  } = useForm<InferType<typeof studentFeesSearchSchema>>({
    resolver: yupResolver(studentFeesSearchSchema),
    // defaultValues: {
    //   registerationNumber: ''
    // }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: feesSetValue,
    watch: feesWatch,
    reset: feesReset
  } = useForm<InferType<typeof studentFeesSchema>>({
    resolver: yupResolver(studentFeesSchema),
    // defaultValues: {
    //   course: '',
    //   semester: '',
    //   modeOfPayment: PaymentMode.CASH,
    //   paidAmount: 0,
    //   payDate: new Date()
    // }
  });

  const onFeesSubmit = async (data: InferType<typeof studentFeesSchema>) => {
    if(student)
    {

      const response = await createStudentFee({
           student: student._id,
           semester: data.semester,
           paidAmount: data.paidAmount,
           modeOfPayment: data.modeOfPayment,
           payDate: data.payDate.toISOString(),
           transactionId: data.transactionId
          });
          if (response?.data?.success) {
            toast.success("Student fees added successfully");
            // router.push("/reports/coursewise");
          } else {
            toast.error(response?.data?.message ?? "Failed to add student fee");
          }
    }
  };
  const onSearchSubmit = async (data: InferType<typeof studentFeesSearchSchema>) => {
      const response = await searchStudent(data.registerationNumber).unwrap();
      console.log('response: ', response);
      if (response?.success && response.data) {
        toast.success("Student found!");
        setStudent(response.data)
      } else {
        toast.error("Student not found!");
      }
      const {semesters} = response.data.course;

        if (semesters && semesters.length > 0) {
    
       const semestersArray: SemesterType = semesters.map(semester=>{
          return {
            label: semester.semesterNumber,
            value: semester._id
          }
        })
        setSemesters(semestersArray)
        }
    feesSetValue("course", response.data.course.name);
    feesSetValue("session", response.data.session);
  };
  const semester = feesWatch("semester");
  const studentRegisterationNumber = searchWatch("registerationNumber");
const handleSemesterChange = async (e)=>{
  if(student)
  {
    const response = await latestStudentFee({semester: e.target.value, student: student._id}).unwrap();
    if (response?.success && response.data) {
      toast.success("Latest Fee found!");
    } else {
      toast.error("Latest Fee not found!");
    }
    console.log('response.data: ', response.data);
    feesSetValue("balanceFees", response.data.balanceFees);
    feesSetValue("discount", response.data.totalDiscount);
    feesSetValue("totalFees", response.data.totalFees);
  }
}
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
              <div className="flex space-x-2 mt-4">
                <Button
                  title="Search"
                  loadingTitle="searching..."
                  type='submit'
                  className='w-fit'
                  isLoading={isLoading}
                />

                <Button
                  title="Cancel"
                  onClick={() => {searchReset(); feesReset(); }}
                  type='button'
                  className='w-fit bg-[#cccccc]'
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
                // disabled={semesters.length === 0}
              >
                <InputLabel id="semester" className="text-[12px]">
                  Semester
                </InputLabel>
                <Select
                  value={semester}
                  labelId="semester"
                  label="Semester"
                  disabled={!student || latestFeeLoading || !studentRegisterationNumber}
                  {...register("semester")}
                  onChange={handleSemesterChange}
                >
                  {semesters.map((sem, index) => (
                    <MenuItem
                      key={index}
                      value={sem.value}
                    >
                      {sem.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.semester && (
                  <small className="text-red-500">
                    {errors.semester.message}
                  </small>
                )}
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
                  label='Total Fees'
                  register={register('totalFees')}
                  disabled
                  placeholder="Auto Filled through Registration Form"
                  error={!!errors.totalFees}
                  message={errors.totalFees?.message}
                />
          </div>
          <div>
          <Input
                  type="number"
                  label='Balance Fees'
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
                  label='Pay Amount'
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
                  value={semester}
                  labelId="modeOfPayment"
                  label="Mode of Payment"
                  disabled={!student}
                  {...register("modeOfPayment")}
                >
                  {Object.values(PaymentMode).map((mod, index) => (
                    <MenuItem
                      key={index}
                      value={mod}
                    >
                      {mod}
                    </MenuItem>
                  ))}
                </Select>
                {errors.modeOfPayment && (
                  <small className="text-red-500">
                    {errors.modeOfPayment.message}
                  </small>
                )}
              </FormControl>
          </div>
          {
            (feesWatch("modeOfPayment") === PaymentMode.ONLINE_TRANSFER) && 
            <div>
            <Input
                  type="text"
                  label='Transaction Id'
                  disabled={!student}
                  register={register('transactionId')}
                  placeholder="Transaction Id"
                  error={!!errors.transactionId}
                  message={errors.transactionId?.message}
                />
          </div>
          }
        </div>
      
        <div className="flex justify-center space-x-2 mt-4">
                <Button
                  title="Submit"
                  loadingTitle="searching..."
                  type='submit'
                  className='w-fit'
                  isLoading={isLoading || createStudentFeeLoading}
                  isDisable={!student}
                />

                <Button
                  title="Cancel"
                  onClick={() => {feesReset(); }}
                  type='button'
                  className='w-fit bg-[#cccccc]'
                />
              </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
