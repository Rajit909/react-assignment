import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';



type Artwork = {
  id: number;
  title: string;
  artist_title: string;
  category: string[];
};

const MyTableComponent = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsToSelect, setRowsToSelect] = useState<string>(''); // Input for number of rows


  // Fetch artworks data from API
  const loadArtworks = async (page = 1) => {
    setLoading(true);
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
    const data = await response.json();
    const artworks = data.data.map((artwork: any) => ({
      id: artwork.id,
      title: artwork.title,
      category: artwork.category_titles,
    }));
    setArtworks(artworks);
    setTotalRecords(data.pagination.total);
    setLoading(false);
  };

  useEffect(() => {
    loadArtworks(first / 10 + 1);  // Calculate page based on 'first'
  }, [first]);

  const onPage = (event: { first: number }) => {
    setFirst(event.first);
  };

  const onSelectionChange = (e: any) => {
    
    setSelectedArtworks(e.value);
  };

  const handleRowSelection = () => {
    const numToSelect = parseInt(rowsToSelect, 10);
    if (!isNaN(numToSelect) && numToSelect > 0 && numToSelect <= artworks.length) {
        const selectedRows = artworks.slice(0, numToSelect);
        setSelectedArtworks(selectedRows);
    }
  }



  return (
    <div className='card'>
      <h2>
        Prime React Table with Row Selection
      </h2>
         <div className='p-field'>
            {/* input field to specify the number of rows */}
            <InputText
              value={rowsToSelect}
              onChange={(e)=>setRowsToSelect(e.target.value)}
              placeholder='Select rows...'
              className='input'
              />
              <Button label='Submit' onClick={handleRowSelection} />
        </div>
       
      <DataTable value={artworks} paginator rows={10} totalRecords={totalRecords} 
        lazy first={first} onPage={onPage} loading={loading}
        selectionMode={selectedArtworks.length === artworks.length ? null : 'checkbox' }
        selection={selectedArtworks} onSelectionChange={onSelectionChange}
        dataKey="id"
        scrollable scrollHeight='400px'
        tableStyle={{minWidth: '20rem', padding:"10px", marginBottom:"10px"}}
            >
        <Column className='col' selectionMode="multiple" ></Column>
        <Column className='col' field="id" header="Code"></Column>
        <Column className='col' field="title" header="Name" ></Column>
        <Column className='col' field="category" header="Category" body={(rowData) => rowData.category.slice(0,1)//to show only first category we uses slice if we want to show all category then we can use join method
        }></Column>
      </DataTable>
    <div style={{padding:"10px"}}>
      <a href="https://github.com/Rajit909/react-assignment/tree/main/prime-table-assignment">Project Source Code</a>
    </div>
    </div>
  );
};

export default MyTableComponent;
