import React, { useEffect, useState } from 'react'
import { APICALL } from '../../helper/api/api'
import CollectionLIst from '../../components/CollectionLIst'
import FrontLoader from '../../components/FrontLoader'
import Alphabet from '../../components/Alphabet'

const ArtistCollections = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [listLoading, setListLoading] = useState(false)
    // const alphabet = Array.from({ length: 26 }, (_, i) =>
    //     String.fromCharCode(65 + i)
    // );
    const [selectedLetter, setSelectedLetter] = useState('');
    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setListLoading(true)
        try {
            const res = await APICALL('user/getPopularCollectionsOverall', 'post', {})
            setListLoading(false)
            if (res?.status) {
                setData(res?.data)
                setFilteredData(res?.data);
            }
        } catch (error) {
            setListLoading(false)
        }
    }
    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        if (letter === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) =>
                item.directoryName.charAt(0).toUpperCase() === letter
            );
            setFilteredData(filtered);
        }
    };

    return (
        <div>
            <div className="aplha_list mt-4">
                <button
                    key="all"
                    style={{ margin: '5px'}}
                    className={selectedLetter === '' ? 'active' : ''}
                    onClick={() => handleLetterClick('')}
                >
                    All
                </button>
                <Alphabet handleLetterClick={handleLetterClick} selectedLetter={selectedLetter}/>
            </div>
            {
                listLoading ? <FrontLoader /> :
                <>
                    {
                        filteredData?.length > 0 ?
                        <CollectionLIst data={filteredData} btnHide={true} />
                        :
                        <div className='text-center mt-3'>
                            <h6>There are no data to display.</h6>
                        </div>
                    }
                </>

            }
        </div>
    )
}

export default ArtistCollections