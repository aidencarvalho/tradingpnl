/**
 *
 * ReadPnL
 *
 */

import { FormLabel } from 'app/components/FormLabel';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import readXlsxFile from 'read-excel-file';
import styled, { useTheme } from 'styled-components/macro';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Title } from '../HomePage/components/Title';
import { Fno } from './components/Fno';
import { Input } from './components/Input';
import { readPnLSaga } from './saga';
import { selectDeliveryData, selectFnOData } from './selectors';
import { readPnLActions, reducer, sliceKey } from './slice';
import { Delivery } from './components/Delivery';
import { TotalPnL } from './components/TotalPnL';
import { CalendarPnL } from './components/Fno/CalendarPnL';
import { Grid } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

interface Props {}

export const ReadPnL = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: readPnLSaga });
  const theme = useTheme();

  const dispatch = useDispatch();

  function getEQFile(files) {
    readXlsxFile(files[0]).then(rows => {
      dispatch(readPnLActions.loadEQData(rows));
    });
  }

  function getFnOFile(files) {
    readXlsxFile(files[0]).then(rows => {
      dispatch(readPnLActions.loadFnOData(rows));
    });
  }

  const fnoData = useSelector(selectFnOData);
  const deliveryData = useSelector(selectDeliveryData);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DropzoneArea
            onChange={getEQFile}
            acceptedFiles={[
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]}
            filesLimit={1}
            useChipsForPreview
            dropzoneText="Upload Equity P&L excel"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DropzoneArea
            onChange={getFnOFile}
            filesLimit={1}
            acceptedFiles={[
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]}
            useChipsForPreview
            dropzoneText="Upload F&O P&L excel"
          />
        </Grid>
      </Grid>
      {((deliveryData && deliveryData?.trades.length > 0) ||
        (fnoData && fnoData.trades.length > 0)) && (
        <Flex>
          <Summary>
            <Title as="h2">Summary</Title>
            <h3 style={{ color: theme.text }}>{`Total Profit ₹${(
              (deliveryData?.netPnL || 0) + (fnoData?.netPnL || 0)
            ).toFixed(2)}`}</h3>
            <TotalPnL />
          </Summary>
          <CalendarPnL />
        </Flex>
      )}
      {fnoData && fnoData.trades.length > 0 && (
        <>
          <Title as="h2">FnO</Title>
          <h3
            style={{ color: theme.text }}
          >{`Total Profit ₹${fnoData.netPnL}`}</h3>
          <Fno fnoData={fnoData} />
        </>
      )}
      {deliveryData && deliveryData.trades.length > 0 && (
        <>
          <Title as="h2">Delivery</Title>
          <h3
            style={{ color: theme.text }}
          >{`Total Profit ₹${deliveryData.netPnL}`}</h3>
          <Delivery deliveryData={deliveryData} />
        </>
      )}
    </>
  );
});

const FormGroup = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  ${FormLabel} {
    margin-bottom: 0.25rem;
    margin-left: 0.125rem;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Input} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
  }
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Summary = styled.div`
  width: 50%;
`;
