---
id: estadisticos-suficientes-naturales-y-parametros-naturales
titulo: Estadísticos suficientes naturales y parámetros naturales
titulo_en: Natural sufficient statistics and natural parameters
alias:
  - estadístico suficiente natural
  - parámetro natural
  - parámetro canónico
  - teorema de factorización
modulo: 2
submodulo: '2.4'
orden: 2
nivel: intermedio
prerrequisitos:
  - familia-exponencial
relaciones:
  - tipo: relacionado
    id: distribuciones-conjugadas
etiquetas:
  - suficiencia
  - parámetro natural
  - reducción de datos
  - verosimilitud
  - familia exponencial
resumen: >
  En una familia exponencial, la suma de los estadísticos T(xᵢ) resume toda la información de la muestra
  sobre el parámetro natural: dos muestras con la misma suma dan la misma verosimilitud.
formula: 'p(\mathbf{x} \mid \boldsymbol{\eta}) = \Big(\prod_{i=1}^{n} h(x_i)\Big)\exp\!\Big(\boldsymbol{\eta}^{\top}\textstyle\sum_{i}\mathbf{T}(x_i) - nA(\boldsymbol{\eta})\Big)'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: suficiencia
    secuencia: '1001100010'
referencias:
  - clave: casella-berger
  - clave: wasserman
publicado: true
---

## Intuición

Una basquetbolista lanza diez tiros libres y encesta cuatro. Para estimar su probabilidad de acierto, ¿importa en qué orden llegaron los aciertos? Intuitivamente no: lo que dice algo sobre su puntería es cuántos encestó, no si los aciertos fueron al principio o al final. Esa intuición tiene una formulación precisa: el número de aciertos es un **estadístico suficiente**, porque una vez conocido, el orden no aporta más información sobre la probabilidad de acierto.

En una familia exponencial esto ocurre siempre. La verosimilitud de una muestra depende de los datos solo a través de una suma, la del estadístico natural de cada observación: el número de éxitos en la Bernoulli, el total en la Poisson, la suma y la suma de cuadrados en la normal. Dos muestras distintas con la misma suma producen exactamente la misma función de verosimilitud y, por lo tanto, las mismas conclusiones.

El parámetro que acompaña a ese estadístico en el exponente es el parámetro natural. En esa coordenada la familia es lineal, lo que simplifica la estimación, la actualización bayesiana y el diseño de modelos.

## Definición

:::definicion[Estadístico suficiente]
Un estadístico $S(\mathbf{X})$ es **suficiente** para $\theta$ si la distribución condicional de la muestra $\mathbf{X}$ dado $S(\mathbf{X})$ no depende de $\theta$. Por el **teorema de factorización**, esto equivale a que la verosimilitud se escriba
$$
p(\mathbf{x} \mid \theta) = g\big(S(\mathbf{x}), \theta\big)\,h(\mathbf{x}).
$$
:::

:::definicion[Estadístico y parámetro naturales]
Si cada observación sigue una familia exponencial $p(x \mid \boldsymbol{\eta}) = h(x)\exp(\boldsymbol{\eta}^{\top}\mathbf{T}(x) - A(\boldsymbol{\eta}))$, entonces para una muestra independiente
$$
p(\mathbf{x} \mid \boldsymbol{\eta}) = \Big(\prod_{i=1}^{n} h(x_i)\Big)\exp\!\Big(\boldsymbol{\eta}^{\top}\textstyle\sum_{i}\mathbf{T}(x_i) - nA(\boldsymbol{\eta})\Big),
$$
y $\sum_i \mathbf{T}(x_i)$ es el **estadístico suficiente natural**; $\boldsymbol{\eta}$ es el **parámetro natural**.
:::

Ejemplos: en la Bernoulli, $\sum_i x_i$ con $\eta = \log\frac{p}{1-p}$; en la Poisson, $\sum_i x_i$ con $\eta = \log\lambda$; en la normal con media y varianza desconocidas, $\big(\sum_i x_i, \sum_i x_i^{2}\big)$ con $\boldsymbol{\eta} = \big(\frac{\mu}{\sigma^{2}}, -\frac{1}{2\sigma^{2}}\big)$.

:::nota[Qué es X]
$\mathbf{X}$ = la muestra completa, por ejemplo la secuencia de diez tiros libres con 1 para acierto y 0 para fallo.
:::

:::nota[Qué hace cada parámetro]
- **$\boldsymbol{\eta}$, parámetro natural:** la coordenada que multiplica al estadístico. Si aumenta, la verosimilitud premia muestras con estadístico mayor.
- **$\sum_i \mathbf{T}(x_i)$, estadístico suficiente:** lo único de los datos que entra en la verosimilitud. Si aumenta el número de aciertos, la curva de verosimilitud se desplaza hacia probabilidades mayores, sin importar el orden.
:::

:::nota[Qué significa cada símbolo]
- $S(\mathbf{X})$: estadístico, función de la muestra; $\theta$: parámetro.
- $g$, $h$: factores de la verosimilitud; $h$ no depende del parámetro.
- $\mathbf{T}(x)$: estadístico natural de una observación; $n$: tamaño de muestra.
- $\boldsymbol{\eta}$: parámetro natural; $A$: función de partición logarítmica.
- $p$, $\lambda$, $\mu$, $\sigma^{2}$: parámetros usuales de la Bernoulli, la Poisson y la normal.
:::

## Cómo usar la visualización

Los diez botones son los tiros de la secuencia; cada clic cambia un acierto por un fallo. La curva continua es la verosimilitud $L(p)$ de la secuencia tal como está, y la punteada es la de la secuencia con los mismos aciertos acomodados al final. El panel da el número de aciertos, el estimador $k/n$ y el valor máximo de la verosimilitud.

Mueve los aciertos de lugar sin cambiar su número y observa que las dos curvas siguen encimadas. Agrega un acierto y observa que el máximo se corre a la derecha. Deja todos en fallo y observa que la curva se pega al cero.

## Ejemplo

Una jugadora lanza 10 tiros libres con resultado 1001100010: cuatro aciertos.

1. Para ensayos de Bernoulli independientes, $L(p) = \prod_{i=1}^{10} p^{x_i}(1 - p)^{1 - x_i} = p^{4}(1 - p)^{6}$.
2. La secuencia 0000001111, con los cuatro aciertos al final, tiene la misma verosimilitud $p^{4}(1 - p)^{6}$.
3. El estadístico suficiente es $k = \sum x_i = 4$; el estimador de máxima verosimilitud es $\hat{p} = 4/10 = 0.4$.
4. En el máximo, $L(0.4) = 0.4^{4} \cdot 0.6^{6} = 0.0256 \cdot 0.046656 \approx 0.001194$.
5. Dado que hubo 4 aciertos, cada uno de los $\binom{10}{4} = 210$ órdenes posibles tiene probabilidad $1/210$, sin importar $p$: el orden no informa sobre la puntería.

:::figura[Diez tiros libres: la verosimilitud de 1001100010 (continua) coincide con la de 0000001111 (punteada), con máximo en p = 0.4.]{componente="FamilyLab"}
```yaml
modo: suficiencia
secuencia: '1001100010'
```
:::

## Propiedades

- **Factorización:** $S$ es suficiente si y solo si la verosimilitud factoriza como $g(S(\mathbf{x}), \theta)h(\mathbf{x})$.
- **Dimensión fija:** en una familia exponencial el estadístico suficiente tiene la misma dimensión que el parámetro, sin importar $n$; los datos se resumen en uno o dos números aunque haya millones de observaciones.
- **Suficiencia mínima:** si los componentes de $\mathbf{T}$ no satisfacen relaciones lineales, $\sum_i\mathbf{T}(x_i)$ es mínimo: no se puede resumir más sin perder información.
- **Linealidad en el parámetro natural:** la log verosimilitud es $\boldsymbol{\eta}^{\top}\sum_i\mathbf{T}(x_i) - nA(\boldsymbol{\eta})$, una función cóncava de $\boldsymbol{\eta}$.
- **Estimador:** el de máxima verosimilitud depende de la muestra solo a través del estadístico suficiente.

:::figura[Más aciertos: con 7 de 10 (1101110110) la verosimilitud se mueve a la derecha y alcanza su máximo en p = 0.7; la secuencia ordenada sigue coincidiendo.]{componente="FamilyLab"}
```yaml
modo: suficiencia
secuencia: '1101110110'
```
:::

:::figura[Muestra grande, mismo resumen: con 16 tiros y 8 aciertos la curva es más angosta que con 10 tiros, aunque el resumen sigue siendo un solo número.]{componente="FamilyLab"}
```yaml
modo: suficiencia
secuencia: '1010011001101010'
```
:::

## Errores comunes

- **Creer que suficiente significa que basta para cualquier pregunta.** Es suficiente para el parámetro del modelo; si el modelo es falso (por ejemplo, tiros que no son independientes), el orden sí puede importar.
- **Tomar el promedio y el estadístico como cosas distintas.** $\sum x_i$ y $\bar{x}$ son igualmente suficientes; cualquier función biyectiva de un estadístico suficiente lo es.
- **Usar solo la media en la normal con varianza desconocida.** Hace falta también $\sum x_i^{2}$ (o la varianza muestral).
- **Confundir el parámetro natural con el usual.** El exponente es lineal en $\boldsymbol{\eta}$, no en $p$ ni en $\sigma^{2}$.

:::figura[Todo fallo: con 0000000000 la verosimilitud (1 - p)^10 es máxima en p = 0, un caso extremo que muestra que el estimador depende solo de cuántos aciertos hubo.]{componente="FamilyLab"}
```yaml
modo: suficiencia
secuencia: '0000000000'
```
:::

## Conexiones

Desarrolla una propiedad central de la [[familia-exponencial]]. El estadístico suficiente natural es lo que actualizan las [[distribuciones-conjugadas]], y la suficiencia de $\sum x_i$ en la [[distribucion-de-bernoulli]] explica por qué la [[distribucion-binomial]] contiene toda la información de una secuencia de ensayos. En inferencia, la suficiencia lleva al teorema de Rao-Blackwell y a la estimación de máxima verosimilitud. El [[mapa-de-relaciones-entre-distribuciones]] reúne las familias del módulo.

## Formulario

:::formula[Teorema de factorización]
$$
p(\mathbf{x} \mid \theta) = g\big(S(\mathbf{x}), \theta\big)\,h(\mathbf{x})
$$

- $S(\mathbf{x})$: estadístico; $\theta$: parámetro; $g$, $h$: factores.
:::

:::formula[Verosimilitud de una muestra de familia exponencial]
$$
p(\mathbf{x} \mid \boldsymbol{\eta}) = \Big(\prod_{i=1}^{n} h(x_i)\Big)\exp\!\Big(\boldsymbol{\eta}^{\top}\textstyle\sum_{i}\mathbf{T}(x_i) - nA(\boldsymbol{\eta})\Big)
$$

- $\mathbf{T}$: estadístico natural; $\boldsymbol{\eta}$: parámetro natural; $A$: función de partición; $n$: tamaño de muestra.
:::

:::formula[Bernoulli]
$$
L(p) = p^{k}(1 - p)^{n - k}, \qquad k = \sum_{i=1}^{n} x_i, \qquad \hat{p} = \frac{k}{n}
$$

- $k$: número de éxitos; $\hat{p}$: estimador de máxima verosimilitud.
:::

:::formula[Normal con media y varianza desconocidas]
$$
\mathbf{T}(x) = (x, x^{2}), \qquad \boldsymbol{\eta} = \left(\frac{\mu}{\sigma^{2}},\ -\frac{1}{2\sigma^{2}}\right)
$$

- $\mu$: media; $\sigma^{2}$: varianza.
:::
