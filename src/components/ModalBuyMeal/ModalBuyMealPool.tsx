import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { useModalPaymentDispatch } from '../../utilities/hooks/ModalPaymentContext/context';
import {
  SET_MODAL_VIEW,
  SET_AMOUNT,
} from '../../utilities/hooks/ModalPaymentContext/constants';
import { useTranslation } from 'react-i18next';
import CampaignInstructions from '../MerchantsPage/gam/CampaignInstructions';
import ReactPixel from 'react-facebook-pixel';

export interface Props {
  purchaseType: string;
  sellerId: string;
  sellerName: string;
  costPerMeal: number;
}

export const Modal = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useModalPaymentDispatch();

  // set initial number of meals to 1
  const [numberOfMeals, setNumberOfMeals] = useState(1);

  const handleAmount = (value: string, customAmount: boolean, text: string) => {
    const valueInt = parseInt(value, 10);
    setNumberOfMeals(isNaN(valueInt) ? 0 : valueInt);
    const totalMealPrice = valueInt * props.costPerMeal;
    dispatch({ type: SET_AMOUNT, payload: String(totalMealPrice) });
  };

  const openModal = (e: any) => {
    ReactPixel.trackCustom('GiftMealPaymentNextButtonClick', {
      numberOfMeals: numberOfMeals,
    });
    e.preventDefault();
    dispatch({ type: SET_MODAL_VIEW, payload: 1 });
  };

  const totalMealPrice = numberOfMeals * props.costPerMeal;
  const totalAmount = { value: totalMealPrice, text: '$' + totalMealPrice };
  const COST_LIMIT = 10000;

  return (
    <form data-testid="ModalBuyMeal">
      <div>
          <h1>{t('buyMealPool.header')}</h1>
      </div>
      <p>
          {t('buyMealPool.description.weAre')}
          <a 
            href="https://www.apexforyouth.org/" 
            target="_blank" rel="noopener noreferrer"
            className={styles.link}
          > APEX for Youth</a>, 
          <a 
            href="http://www.lajornadany.org/" 
            target="_blank" rel="noopener noreferrer"
            className={styles.link}
          > La Jornada Food Pantry</a>, 
          <a 
            href="https://www.cpc-nyc.org/" 
            target="_blank" rel="noopener noreferrer"
            className={styles.link}
          > the Chinese-American Planning Council </a>
          {t('buyMealPool.description.andRestaurants')} 
          <span className={styles.bold}> {t('buyMealPool.description.allItTakes')}</span>
      </p>

      <CampaignInstructions isModal={true} />

      <div className={styles.amountContainer}>
        <label htmlFor="select-amount">{t('buyMeal.prompt')}</label>
        <br />
        <div className={styles.selectAmtContainer}>
          <div className={styles.selectAmt}>
            <input
              name="custom-amount"
              type="number"
              onFocus={(e) => handleAmount('', true, '')}
              className={classnames(styles.customAmt, 'modalInput--input')}
              onChange={(e) => {
                handleAmount(e.target.value, true, '');
              }}
              value={numberOfMeals === 0 ? '' : String(numberOfMeals)}
              placeholder="# of meals"
              min="1"
            />
            <span className={styles.separator}>✕</span>
            <button
              type="button"
              className={classnames(
                styles.costPerMeal,
                'modalButton--nonfunctional'
              )}
              disabled={true}
            >
              {'$' + props.costPerMeal}
            </button>
          </div>
          <label className={styles.total}>
            {t('buyMeal.totalLabel')} <b>{totalAmount.text}</b>
          </label>
        </div>
        <br />
      </div>

      <button
        type="button"
        className={classnames(styles.nextBtn, 'modalButton--filled')}
        onClick={openModal}
        disabled={
          numberOfMeals < 1 || numberOfMeals > COST_LIMIT / props.costPerMeal
        }
      >
        {t('paymentProcessing.amount.submit')}
      </button>
    </form>
  );
};

export default Modal;

