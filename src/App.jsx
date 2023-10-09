/* eslint-disable react/jsx-key */
import { useEffect, useState, useMemo } from 'react'
import './App.css'
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
const COLUMNS = [
  {
    Header: '#',
    accessor: (values, i) => {
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
    accessor: 'jumlah_formasi',
  },
  {
    Header: 'Jlh Jur',
    accessor: (values) => values.pendidikan_nm.split("/").length,
  },
  {
    Header: 'Gaji',
    accessor:  (values) => Number(values.gaji_min/1000000).toFixed(1) +"-"+Number(values.gaji_max/1000000).toFixed(1),
  },
];
function App() {
  const [data, setData] = useState([])
  const columns = useMemo(() => COLUMNS, []);
  const [jurusan, setJurusan] = useState("s1Matematika")
  const [tipe, setTipe] = useState({
    cpns: true,
    pppkUmum: true,
    pppkKhusus: false
  })
  const tableInstance = useTable({ columns, data });
  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
  useEffect(() => {
    async function getData() {
      let response = null
      if (jurusan === "s1Matematika") {
        response = await fetch("https://raw.githubusercontent.com/ddsuhaimi/cpns-job-fetch/main/s1matematika.json")
      } else if (jurusan === "d4TeknikInformatika") {
        response = await fetch("https://raw.githubusercontent.com/ddsuhaimi/cpns-job-fetch/main/d4teknikinformatika.json")
      }
      const jb = await response.json()
      // console.log("🚀 ~ file: App.jsx:40 ~ getData ~ jb:", jb)
      let filteredData = jb.data
      filteredData = filteredData.filter(item => item.disable === "0")
      const cpnsFilter = filteredData.filter(item => tipe.cpns && item.jp_nama === "CPNS")
      const p3kUmumFilter = filteredData.filter(item => tipe.pppkUmum && item.jp_nama === "PPPK Teknis" && item.formasi_nm === "UMUM")
      const p3kKhususFilter = filteredData.filter(item => tipe.pppkKhusus && item.jp_nama === "PPPK Teknis" && item.formasi_nm === "KHUSUS")
      filteredData = [...cpnsFilter, ...p3kUmumFilter, ...p3kKhususFilter]
      setData(filteredData)
    }
    getData()
  }, [jurusan, tipe])

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
        <label>
          <input type="checkbox" checked={tipe.cpns} onChange={e => setTipe(tipe => ({ ...tipe, cpns: e.target.checked }))} />
          CPNS
        </label>
        <label>
          <input type="checkbox" checked={tipe.pppkUmum} onChange={e => setTipe(tipe => ({ ...tipe, pppkUmum: e.target.checked }))} />
          PPPK Umum
        </label>
        <label>
          <input type="checkbox" checked={tipe.pppkKhusus} onChange={e => setTipe(tipe => ({ ...tipe, pppkKhusus: e.target.checked }))} />
          PPPK Khusus
        </label>
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
