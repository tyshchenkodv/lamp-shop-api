module.exports = (soldedProducts) => {
    if(!soldedProducts) return new Error('Undefined input data!')
    const productCount = Object.keys(soldedProducts).length < 5 ? Object.keys(soldedProducts).length : 5;
    let productIdsToPurchase = [];

    for(let k = 0; k < productCount; k++) {
        let vald = { value: 0 };

        for (let key in soldedProducts) {
            if(vald.value < Math.min(soldedProducts[key][0], soldedProducts[key][1])) {
                vald.id = key;
                vald.value = Math.min(soldedProducts[key][0], soldedProducts[key][1]);
            }
        }

        let bayes = { value: -1 };

        for (let key in soldedProducts) {
            if(bayes.value < soldedProducts[key][0] * 0.3 + soldedProducts[key][1]*0.7) {
                bayes.id = key;
                bayes.value = soldedProducts[key][0] * 0.3 + soldedProducts[key][1]*0.7;
            }
        }

        let hurviz = { s: 0 };

        for (let key in soldedProducts) {
            const minA = Math.min(soldedProducts[key][0], soldedProducts[key][1]);
            const maxA = Math.max(soldedProducts[key][0], soldedProducts[key][1]);
            if (hurviz.s < 0.3 * minA + 0.7 * maxA) {
                hurviz.id = key;
                hurviz.s = 0.3 * minA + 0.7 * maxA;
            }
        }

        const criteriesIds = [vald.id, bayes.id, hurviz.id];

        let mf = 1;
        let m = 0;
        let item;
        for (let i=0; i<criteriesIds.length; i++)
        {
            for (let j=i; j<criteriesIds.length; j++)
            {
                if (criteriesIds[i] == criteriesIds[j])
                    m++;
                if (mf<m)
                {
                    mf=m;
                    item = criteriesIds[i];
                }
            }
            m=0;
        }

        productIdsToPurchase.push(item);
        delete soldedProducts[item];
    }
    return productIdsToPurchase;
}
