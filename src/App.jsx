/* eslint-disable react/jsx-key */
import { useEffect, useState, useMemo } from 'react'
import './App.css'
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
const COLUMNS = [
  {
    Header: '#',
    accessor: (values, i) => {
      console.log(values)
      return i
    },
  },
  {
    Header: 'Jabatan',
    accessor: 'jabatan_nm',
  },
  {
    Header: 'Instansi',
    accessor: 'ins_nm',
  },
  {
    Header: 'Lokasi',
    accessor: 'lokasi_nm',
  },
  {
    Header: 'Jenis',
    accessor: (values) => values.jp_nama + " " + values.formasi_nm,
  },
  {
    Header: 'Formasi',
    accessor: 'pengadaan_kd',
  },
  {
    Header: 'Jlh Jur',
    accessor: (values) => values.pendidikan_nm.split("/").length,
  },
];
function App() {
  const [data, setData] = useState([])
  const columns = useMemo(() => COLUMNS, []);
  const [jurusan, setJurusan] = useState("s1Matematika")
  const tableInstance = useTable({ columns, data });
  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
  useEffect(() => {
    async function getData() {
      let response = null
      if (jurusan === "s1Matematika") {
        response = await fetch("https://raw.githubusercontent.com/ddsuhaimi/cpns-job-fetch/main/s1matematika.json")
      } else if (jurusan === "d4TeknikInformatika"){
        response = await fetch("https://raw.githubusercontent.com/ddsuhaimi/cpns-job-fetch/main/d4teknikinformatika.json") 
      }
      const jb = await response.json()
      console.log("🚀 ~ file: App.jsx:40 ~ getData ~ jb:", jb)
      setData(jb.data.filter(item => item.disable === "0"))
    }
    getData()
  }, [jurusan])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy
  );
  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }

  const { globalFilter } = state;

  return (
    <div className='text-xs'>


      <div className="mt-2 mb-4 search-container ">
        <label htmlFor="cars">Pilih jurusan:</label>
        <select onChange={(e) => setJurusan(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
          <option value="s1Matematika" selected>S1 Matematika</option>
          <option value="d4TeknikInformatika">D4 Teknik Informatika</option>
        </select>
        <label htmlFor="first_name">Cari:</label>
        <input type="text" id="first_name"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Cari disini, ketik dan enter" required />
        {/* 
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
        /> */}
      </div>

      <span>- klik di kolom table untuk sorting</span>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {generateSortingIndicator(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App
