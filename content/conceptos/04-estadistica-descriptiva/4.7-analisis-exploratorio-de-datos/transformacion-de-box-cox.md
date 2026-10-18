---
id: transformacion-de-box-cox
titulo: Transformación de Box-Cox
titulo_en: Box-Cox transformation
alias:
  - transformación de potencia
  - Box-Cox
modulo: 4
submodulo: '4.7'
orden: 10
nivel: intermedio
prerrequisitos:
  - transformacion-logaritmica-y-de-raiz
relaciones:
  - tipo: generaliza
    id: transformacion-logaritmica-y-de-raiz
etiquetas:
  - transformaciones
  - normalidad
  - verosimilitud
  - asimetría
resumen: >
  La transformación de Box-Cox es una familia de potencias para datos positivos, indexada por lambda, que
  incluye el logaritmo y la raíz. Lambda se elige maximizando la verosimilitud de que los datos
  transformados sean normales.
formula: 'y^{(\lambda)} = \begin{cases} \dfrac{x^{\lambda} - 1}{\lambda} & \lambda \ne 0 \\ \log x & \lambda = 0 \end{cases}'
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: box-cox
    muestra:
      nombre: Plomo
      forma: sesgo-derecha
      parametro: 3
      centro: 5
      escala: 2
      n: 250
    eje:
      variable: Plomo en sangre
      unidad: µg/dL
referencias:
  - clave: james-isl
  - clave: casella-berger
publicado: true
---

## Intuición

Una campaña de salud mide el plomo en sangre de 250 niños. Los valores tienen cola derecha: el logaritmo podría corregirla, pero quizá la raíz cuadrada sea suficiente, o quizá haga falta algo más fuerte. En lugar de probar a mano, George Box y David Cox propusieron en 1964 una familia continua de transformaciones, controlada por un solo número $\lambda$: con $\lambda = 1$ los datos quedan casi igual, con $\lambda = 1/2$ es como sacar raíz, con $\lambda = 0$ es el logaritmo, con $\lambda = -1$ es como el recíproco, y entre ellos hay todas las opciones intermedias.

Para elegir $\lambda$ se pregunta qué valor hace que los datos transformados se parezcan más a una muestra normal, medido con la verosimilitud. Se barre $\lambda$, se calcula un puntaje para cada valor y se toma el máximo. Así la transformación deja de ser una elección a ojo y se vuelve un estimador.

## Definición

:::definicion[Transformación de Box-Cox]
Para datos positivos $x_1, \dots, x_n$ y un parámetro real $\lambda$,
$$
y^{(\lambda)} = \begin{cases} \dfrac{x^{\lambda} - 1}{\lambda} & \lambda \ne 0, \\[2mm] \log x & \lambda = 0. \end{cases}
$$
La forma $(x^\lambda - 1)/\lambda$ hace que la familia sea continua en $\lambda = 0$, porque $\lim_{\lambda \to 0} (x^\lambda - 1)/\lambda = \log x$, y creciente en $x$ para todo $\lambda$.
:::

:::definicion[Elección de lambda por verosimilitud]
Suponiendo que $y_i^{(\lambda)}$ son normales con media y varianza desconocidas, la log-verosimilitud perfil de $\lambda$, salvo una constante, es
$$
\ell(\lambda) = -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \log x_i,
$$
donde $\hat{\sigma}^2(\lambda)$ es la varianza (con denominador $n$) de los datos transformados. El segundo término es el logaritmo del jacobiano de la transformación. El estimador es $\hat{\lambda} = \arg\max_\lambda \ell(\lambda)$, que en la práctica suele redondearse a un valor interpretable como $0$, $1/2$ o $-1$.
:::

Condiciones: todos los $x_i$ deben ser positivos. La transformación busca normalidad aproximada; si los datos son bimodales, ningún $\lambda$ los volverá normales.

:::nota[Qué significa cada símbolo]
- $x$, $x_i$: valores originales positivos; $n$: número de datos.
- $\lambda$: parámetro de la transformación.
- $y^{(\lambda)}$: valor transformado.
- $\ell(\lambda)$: log-verosimilitud perfil.
- $\hat{\sigma}^2(\lambda)$: varianza de los datos transformados, con denominador $n$.
- $\hat{\lambda}$: valor de $\lambda$ que maximiza $\ell$; $\arg\max$: el argumento donde se alcanza el máximo.
:::

## Cómo usar la visualización

A la izquierda está el histograma de los datos transformados con la curva normal de la misma media y desviación; a la derecha, la log-verosimilitud perfil $\ell(\lambda)$. Al reproducir, $\lambda$ barre de $-2$ a $3$, la curva se dibuja y el histograma cambia de forma; al terminar se marca $\hat{\lambda}$ con una línea punteada.

Después del barrido, el control **Parámetro de la transformación** fija $\lambda$ a mano.

Experimentos sugeridos:

1. Detener el barrido en $\lambda = 1$: el histograma conserva la cola derecha.
2. Al terminar, comparar la asimetría transformada con $\lambda = \hat{\lambda}$: es cercana a cero.
3. Llevar $\lambda$ a 2: la cola pasa al lado izquierdo y $\ell(\lambda)$ baja mucho.

## Ejemplo

Cinco datos que se duplican: 1, 2, 4, 8 y 16, con $\sum \log x_i = \log 1024 \approx 6.931$.

1. Con $\lambda = 1$: transformados 0, 1, 3, 7 y 15; $\hat{\sigma}^2 = 29.76$; $\ell(1) = -2.5 \log 29.76 + 0 \approx -8.483$.
2. Con $\lambda = 1/2$: transformados 0, 0.828, 2, 3.657 y 6; $\hat{\sigma}^2 \approx 4.576$; $\ell(1/2) = -2.5\log 4.576 - 0.5 \cdot 6.931 \approx -7.268$.
3. Con $\lambda = 0$: transformados 0, 0.693, 1.386, 2.079 y 2.773, equiespaciados; $\hat{\sigma}^2 \approx 0.961$; $\ell(0) = -2.5 \log 0.961 - 6.931 \approx -6.832$.
4. El máximo está en $\lambda = 0$: el logaritmo vuelve equiespaciados unos datos que crecen en forma geométrica.

:::figura[Los cinco datos del ejemplo con su curva de log-verosimilitud, que alcanza el máximo en lambda igual a cero.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Duplicaciones
  valores: [1, 2, 4, 8, 16]
eje:
  variable: Valor
```
:::

## Propiedades

- **Casos particulares:** $\lambda = 1$ es un desplazamiento de los datos originales, $\lambda = 1/2$ equivale a la raíz, $\lambda = 0$ al logaritmo y $\lambda = -1$ al recíproco, salvo constantes que no cambian la forma.
- **Monotonía:** para todo $\lambda$ la transformación es creciente y conserva el orden de los datos.
- **El término del jacobiano** impide que $\lambda$ se elija solo para encoger la varianza; sin él, siempre convendría la transformación que comprime más.
- **Invariancia de escala del estimador:** multiplicar los datos por una constante no cambia $\hat{\lambda}$.

:::figura[Datos ya simétricos: estaturas normales. El máximo de la verosimilitud queda cerca de lambda igual a uno, es decir, no hace falta transformar.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Estaturas
  forma: normal
  centro: 165
  escala: 8
  n: 250
eje:
  variable: Estatura
  unidad: cm
```
:::

## Errores comunes

- **Aplicarla a datos con ceros o negativos.** Box-Cox exige positivos; la alternativa es la transformación de Yeo-Johnson o sumar una constante, que cambia $\hat{\lambda}$.
- **Esperar normalidad perfecta.** Box-Cox encuentra la mejor potencia, no garantiza una normal: datos bimodales siguen siendo bimodales.
- **Olvidar que la interpretación cambia.** Un modelo en la escala transformada habla de $y^{(\lambda)}$; al volver a la escala original hay que invertir la transformación con cuidado.

:::figura[Datos bimodales: tiempos de dos procesos mezclados. Ninguna lambda produce una normal; la curva elegida conserva los dos picos.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Tiempos
  forma: mezcla
  parametro: 5
  centro: 30
  escala: 3
  n: 250
eje:
  variable: Tiempo de proceso
  unidad: min
```
:::

## Conexiones

Box-Cox generaliza la [[transformacion-logaritmica-y-de-raiz]] y se extiende a datos con ceros y negativos con la [[transformacion-de-yeo-johnson]]. Su objetivo es reducir la [[asimetria-muestral]] y acercar los datos a la normalidad, lo que se revisa con un [[grafico-q-q]]. La elección de $\lambda$ por máxima verosimilitud se estudia en inferencia estadística.

## Formulario

:::formula[Transformación de Box-Cox]
$$
y^{(\lambda)} = \begin{cases} \dfrac{x^{\lambda} - 1}{\lambda} & \lambda \ne 0 \\ \log x & \lambda = 0 \end{cases}
$$

- $x$: dato positivo; $\lambda$: parámetro; $y^{(\lambda)}$: valor transformado.
:::

:::formula[Log-verosimilitud perfil]
$$
\ell(\lambda) = -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \log x_i
$$

- $n$: número de datos; $\hat{\sigma}^2(\lambda)$: varianza de los transformados con denominador $n$.
- $(\lambda - 1)\sum \log x_i$: logaritmo del jacobiano de la transformación.
:::

:::formula[Estimador de lambda]
$$
\hat{\lambda} = \arg\max_{\lambda} \ell(\lambda)
$$

- Valor de $\lambda$ que hace más verosímil la normalidad de los transformados.
:::

:::formula[Límite en cero]
$$
\lim_{\lambda \to 0} \frac{x^{\lambda} - 1}{\lambda} = \log x
$$

- Justifica que el logaritmo sea el caso $\lambda = 0$.
:::
