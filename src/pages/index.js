import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import Table from '../components/Table'
import { getAccountDetails, storeData } from "../redux/action/actions";
import ViewAction from "../components/Common/Actions/ViewAction";
import { useHistory } from "react-router-dom";

const Index = () => {

  const { data } = useSelector((state) => state.all);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const getApiData = () => {
    setLoading(true)
    try {
      fetch(
        "https://api.sampleapis.com/fakebank/accounts")
        .then(res => res.json())
        .then((json) => {
          dispatch(storeData(json))
          setLoading(false)
        })
    } catch (error) {

    }

  }

  const tabelHeaders = [
    {
      id: 'transactionDate',
      label: 'Date',
    },
    {
      id: 'category',
      label: 'Category',
    },
    {
      id: 'description',
      label: 'Description',
    },
    {
      id: 'debit',
      label: 'Debit',
    },
    {
      id: 'credit',
      label: 'Credit',
    },
  ];


  React.useEffect(() => {
    getApiData()
  }, [])

  const ViewActionBtn = (action) => (
    <ViewAction title="View Details"
      onClick={() => history.push(`/${action.data.id}`)}
    />
  );
  return (
    <>
      <Table loading={loading} tableData={data} dateFileterField="transactionDate" searchByLabel="description" searchByField={["description"]} perPageRows={10} paginated={true} title={'Account list'} actions={[ViewActionBtn]} tableHeaders={tabelHeaders} />
    </>
  );
};

export default Index;
