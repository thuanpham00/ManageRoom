import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { path } from "src/constants/path"
import { TypeUser } from "src/types/branches.type"
import { toast } from "react-toastify"
import { userAPI } from "src/apis/user.api"

type FormData = TypeUser

export default function UpdateUser() {
  const { nameId } = useParams()

  const navigate = useNavigate()

  const getUserDetailQuery = useQuery({
    queryKey: ["userDetail", nameId],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000)
      return userAPI.detailUser(nameId as string)
    },
    retry: 1, // số lần fetch lại khi thất bại
    placeholderData: keepPreviousData, // giữ data cũ
    staleTime: 5 * 60 * 1000 // dưới 5 phút không refetch api
  })
  const userDetailData = getUserDetailQuery.data?.data as TypeUser

  const updateUserMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: TypeUser }) => {
      return userAPI.updateUser({ id, body }) // Gọi hàm updateBranch với đối tượng chứa id và body
    }
  })

  const { handleSubmit, register } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    const body = {
      email: data.email,
      phone: data.phone,
      fullname: data.fullname,
      nationality: data.nationality,
      last_booking: data.last_booking,
      nights: data.nights,
      books: data.books,
      create_at: data.create_at,
      update_at: String(new Date()),
      roles: data.roles
    }

    updateUserMutation.mutate(
      { id: nameId as string, body },
      {
        onSuccess: () => {
          toast.success("Cập nhật người dùng thành công")
          navigate(path.listUser)
          window.location.reload() // Cập nhật lại trang
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  })

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="py-4 px-6 relative">
      <div className="flex items-center gap-1">
        <button onClick={handleBack} className="text-sm flex items-center hover:text-gray-400 duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Trở lại
        </button>
        <h1 className="ml-1 text-base uppercase text-gray-600 font-semibold">Quản lý người dùng</h1>
        <span className="text-sm text-[#6c757d]"> / </span>
        <span className="text-sm text-[#3a86ff]">Cập nhật thông tin người dùng</span>
      </div>

      {!getUserDetailQuery.isFetching && (
        <form onSubmit={onSubmit} className="mt-2 p-4 bg-white rounded shadow-md overflow-y-scroll h-[550px]">
          <h2 className="text-xl font-bold mb-4">Cập nhật thông tin</h2>

          <div>
            <div className="flex items-center gap-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mã người dùng:</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-[200px] p-2 border border-gray-300 rounded text-sm"
                  {...register("id")}
                  defaultValue={userDetailData.id}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên người dùng:</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                  defaultValue={userDetailData.fullname}
                  {...register("fullname")}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="text"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                defaultValue={userDetailData.phone}
                {...register("phone")}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="text"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                defaultValue={userDetailData.email}
                {...register("email")}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quốc tịch:</label>
              <input
                type="text"
                required
                className="mt-1 block w-[300px] p-2 border border-gray-300 rounded text-sm"
                defaultValue={userDetailData.nationality}
                {...register("nationality")}
              />
            </div>

            <div className="flex items-center gap-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thời gian đặt phòng gần nhất:</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                  defaultValue={userDetailData.last_booking}
                  {...register("last_booking")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số đêm đã đặt:</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                  defaultValue={userDetailData.nights}
                  {...register("nights")}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Số lần đặt phòng:</label>
              <input
                type="text"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                defaultValue={userDetailData.books}
                {...register("books")}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Vai trò:</label>
              <input
                type="text"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded text-sm"
                defaultValue={userDetailData.roles}
                {...register("roles")}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                // onClick={handleClear}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 duration-200 text-sm"
              >
                Xóa
              </button>
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200 text-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
