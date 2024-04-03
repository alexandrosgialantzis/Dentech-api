import { Types } from 'mongoose';
import Credit from '../models/Credit';
import { CreditStatus } from '../types/enums';
import { ICredit } from '../types/interfaces';

export const handleCredits = async (
  orderId: Types.ObjectId,
  payloadIds?: Types.ObjectId[],
  ordersCreditsIds?: Types.ObjectId[]
) => {
  if (!ordersCreditsIds?.length && !payloadIds?.length) {
    return;
  }

  const hasPayloadAndOrderCredIds =
    payloadIds &&
    ordersCreditsIds &&
    payloadIds?.length === ordersCreditsIds?.length;
  if (hasPayloadAndOrderCredIds) {
    const payloadIdsStr = payloadIds.map((id) => id.toString()).sort();
    const ordersCreditsIdsStr = ordersCreditsIds
      .map((id) => id.toString())
      .sort();

    const arraysAreEqual = payloadIdsStr.every(
      (id, index) => id === ordersCreditsIdsStr[index]
    );

    if (arraysAreEqual) {
      return;
    } else {
      const toRemove = ordersCreditsIdsStr.filter(
        (id) => !payloadIdsStr.includes(id)
      );
      if (toRemove.length) {
        await putOrderToCredits(toRemove, orderId);
      }

      const toAdd = payloadIdsStr.filter(
        (id) => !ordersCreditsIdsStr.includes(id)
      );
      if (toAdd.length) {
        for (const id of toAdd) {
          const cred = (await Credit.findById(id)) as ICredit;

          cred.isUsed = CreditStatus.USED;
          cred.order = orderId;
          await cred.save();
        }
      }
    }
  }

  const hasOnlyPayloadIds =
    (payloadIds && !ordersCreditsIds) ||
    (!ordersCreditsIds?.length && payloadIds?.length);
  if (hasOnlyPayloadIds) {
    await putOrderToCredits(payloadIds, orderId);
  }
};

const putOrderToCredits = async (
  ids: Types.ObjectId[] | string[],
  orderId: Types.ObjectId
) => {
  for (const id of ids) {
    const cred = await Credit.findById(id);

    if (cred) {
      cred.isUsed = CreditStatus.USED;
      cred.order = orderId;
      await cred.save();
    }
  }
};
