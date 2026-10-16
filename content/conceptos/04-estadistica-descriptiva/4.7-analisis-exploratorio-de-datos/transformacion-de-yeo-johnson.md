---
id: transformacion-de-yeo-johnson
titulo: Transformación de Yeo-Johnson
titulo_en: Yeo-Johnson transformation
alias:
  - Yeo-Johnson
  - transformación de potencia para datos reales
modulo: 4
submodulo: '4.7'
orden: 11
nivel: intermedio
prerrequisitos:
  - transformacion-de-box-cox
relaciones:
  - tipo: generaliza
    id: transformacion-de-box-cox
etiquetas:
  - transformaciones
  - normalidad
  - datos negativos
  - asimetría
resumen: >
  La transformación de Yeo-Johnson extiende la de Box-Cox a datos con ceros y negativos: aplica una
  potencia a x + 1 para los valores no negativos y la potencia reflejada 2 - lambda a 1 - x para los negativos.
formula: 'y^{(\lambda)} = \begin{cases} \dfrac{(x + 1)^{\lambda} - 1}{\lambda} & x \ge 0,\ \lambda \ne 0 \\ -\dfrac{(1 - x)^{2 - \lambda} - 1}{2 - \lambda} & x < 0,\ \lambda \ne 2 \end{cases}'
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: yeo-johnson
    muestra:
      nombre: Cambio en ventas
      forma: sesgo-derecha
      parametro: 2
      centro: 3
      escala: 6
      n: 250
    eje:
      variable: Cambio anual en ventas
      unidad: '%'
referencias:
  - clave: james-isl
publicado: true
---

## Intuición

Una cadena de tiendas registra el cambio porcentual anual en ventas de 250 sucursales. La mayoría crece entre 0 % y 10 %, algunas pierden ventas (valores negativos) y unas pocas crecen 25 % o más: hay una cola derecha. La transformación de Box-Cox no sirve, porque exige datos positivos; sumar una constante para volverlos positivos funciona, pero la elección de la constante es arbitraria y cambia el resultado.

In-Kwon Yeo y Richard Johnson propusieron en el año 2000 una familia que acepta cualquier número real. Para los valores no negativos aplica la potencia de Box-Cox a $x + 1$, de modo que el cero queda en cero. Para los negativos aplica la misma idea en espejo: transforma $1 - x$ con la potencia $2 - \lambda$ y le cambia el signo. El resultado es una función continua y creciente que comprime una cola y estira la otra según el valor de $\lambda$, que se elige otra vez por verosimilitud.

## Definición

:::definicion[Transformación de Yeo-Johnson]
Para un número real $x$ y un parámetro $\lambda$,
$$
y^{(\lambda)} = \begin{cases}
\dfrac{(x + 1)^{\lambda} - 1}{\lambda} & x \ge 0,\ \lambda \ne 0, \\[2mm]
\log(x + 1) & x \ge 0,\ \lambda = 0, \\[2mm]
-\dfrac{(1 - x)^{2 - \lambda} - 1}{2 - \lambda} & x < 0,\ \lambda \ne 2, \\[2mm]
-\log(1 - x) & x < 0,\ \lambda = 2.
\end{cases}
$$
Es continua, creciente y vale 0 en $x = 0$. Con $\lambda = 1$ es la identidad. El parámetro se estima maximizando
$$
\ell(\lambda) = -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \operatorname{sgn}(x_i)\log(|x_i| + 1).
$$
:::

Interpretación de $\lambda$: con $\lambda < 1$ se comprime la cola derecha (para asimetría positiva); con $\lambda > 1$ se comprime la cola izquierda (para asimetría negativa).

:::nota[Qué significa cada símbolo]
- $x$, $x_i$: valores originales, reales; $n$: número de datos.
- $\lambda$: parámetro de la transformación.
- $y^{(\lambda)}$: valor transformado.
- $\ell(\lambda)$: log-verosimilitud perfil, salvo una constante.
- $\hat{\sigma}^2(\lambda)$: varianza de los datos transformados con denominador $n$.
- $\operatorname{sgn}(x_i)$: signo de $x_i$ ($1$, $0$ o $-1$).
:::

## Cómo usar la visualización

Igual que con Box-Cox: a la izquierda, el histograma de los datos transformados con su curva normal de referencia; a la derecha, la log-verosimilitud $\ell(\lambda)$. El barrido de $\lambda$ termina en $\hat{\lambda}$, y después el control **Parámetro de la transformación** permite moverlo a mano. La fórmula del encabezado muestra las dos ramas, para valores no negativos y negativos.

Experimentos sugeridos:

1. Detener el barrido en $\lambda = 1$: el histograma es el de los datos originales, con valores negativos y cola derecha.
2. Al terminar, observar que $\hat{\lambda} < 1$: la cola derecha se comprime y los negativos se estiran ligeramente.
3. Llevar $\lambda$ a 2: la cola izquierda se comprime de más y la asimetría cambia de signo.

## Ejemplo

Cinco cambios porcentuales: $-2$, $-0.5$, $0$, $1$ y $3$, con $\lambda = 0.5$.

1. $x = 3 \ge 0$: $y = ((3 + 1)^{0.5} - 1)/0.5 = (2 - 1)/0.5 = 2$.
2. $x = 1$: $y = (\sqrt{2} - 1)/0.5 \approx 0.828$.
3. $x = 0$: $y = 0$.
4. $x = -0.5 < 0$: con $2 - \lambda = 1.5$, $y = -\big((1.5)^{1.5} - 1\big)/1.5 \approx -0.558$.
5. $x = -2$: $y = -\big(3^{1.5} - 1\big)/1.5 \approx -2.797$.

Con $\lambda = 0.5$ los valores positivos se comprimen (3 pasa a 2) y los negativos se estiran ($-2$ pasa a $-2.8$): la cola derecha se acorta respecto a la izquierda.

:::figura[Los cinco cambios del ejemplo: la curva de log-verosimilitud y el histograma transformado; con el control se puede fijar lambda en 0.5.]{componente="FeatureTransformViz"}
```yaml
modo: yeo-johnson
muestra:
  nombre: Cambios
  valores: [-2, -0.5, 0, 1, 3]
eje:
  variable: Cambio
  unidad: '%'
lambda: 0.5
```
:::

## Propiedades

- **Definida en todos los reales,** sin necesidad de sumar constantes.
- **Coincide con Box-Cox desplazada** para datos no negativos: $y^{(\lambda)}(x) = \text{BoxCox}_\lambda(x + 1)$.
- **Simetría de las ramas:** la rama negativa con parámetro $\lambda$ es el reflejo de la positiva con parámetro $2 - \lambda$, de modo que $\lambda = 1$ es la identidad en ambos lados.
- **Continua y creciente,** con derivada positiva en $x = 0$.

:::figura[Asimetría negativa: rendimientos con cola izquierda. El máximo de la verosimilitud queda en lambda mayor que uno, que comprime la cola izquierda.]{componente="FeatureTransformViz"}
```yaml
modo: yeo-johnson
muestra:
  nombre: Rendimientos
  forma: sesgo-izquierda
  parametro: 3
  centro: 1
  escala: 3
  n: 250
eje:
  variable: Rendimiento mensual
  unidad: '%'
```
:::

## Errores comunes

- **Usarla cuando los datos son positivos y Box-Cox basta.** Funciona, pero su $\lambda$ no es comparable con el de Box-Cox, porque transforma $x + 1$ y no $x$.
- **Interpretar $\lambda$ igual que en Box-Cox.** Con Yeo-Johnson, $\lambda = 0$ no es el logaritmo de $x$ sino el de $x + 1$, y la escala de los datos influye en el resultado.
- **Esperar que corrija cualquier forma.** Como Box-Cox, ataca la asimetría; no vuelve normales datos bimodales ni de colas pesadas simétricas.

:::figura[Colas pesadas simétricas: diferencias diarias de temperatura. La asimetría es moderada y lambda óptima queda cerca de uno: la transformación apenas cambia los datos y las colas pesadas siguen ahí.]{componente="FeatureTransformViz"}
```yaml
modo: yeo-johnson
muestra:
  nombre: Diferencias
  forma: colas-pesadas
  parametro: 3
  centro: 0
  escala: 2
  n: 250
eje:
  variable: Diferencia de temperatura
  unidad: °C
```
:::

## Conexiones

Yeo-Johnson generaliza la [[transformacion-de-box-cox]], que a su vez generaliza la [[transformacion-logaritmica-y-de-raiz]]. Busca reducir la [[asimetria-muestral]]; el resultado se revisa con un [[grafico-q-q]]. Las colas pesadas, que estas transformaciones no corrigen, se estudian en [[colas-ligeras-y-pesadas-en-datos]].

## Formulario

:::formula[Rama no negativa]
$$
y^{(\lambda)} = \frac{(x + 1)^{\lambda} - 1}{\lambda}\quad (x \ge 0,\ \lambda \ne 0),\qquad y^{(0)} = \log(x + 1)
$$

- $x$: valor no negativo; $\lambda$: parámetro.
:::

:::formula[Rama negativa]
$$
y^{(\lambda)} = -\frac{(1 - x)^{2 - \lambda} - 1}{2 - \lambda}\quad (x < 0,\ \lambda \ne 2),\qquad y^{(2)} = -\log(1 - x)
$$

- $x$: valor negativo; la potencia reflejada usa $2 - \lambda$.
:::

:::formula[Log-verosimilitud perfil]
$$
\ell(\lambda) = -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \operatorname{sgn}(x_i)\log(|x_i| + 1)
$$

- $\hat{\sigma}^2(\lambda)$: varianza de los transformados con denominador $n$; $\operatorname{sgn}$: signo.
:::

:::formula[Relación con Box-Cox]
$$
y^{(\lambda)}(x) = \frac{(x + 1)^{\lambda} - 1}{\lambda} = \text{BoxCox}_{\lambda}(x + 1),\qquad x \ge 0
$$

- $\text{BoxCox}_{\lambda}$: transformación de Box-Cox con parámetro $\lambda$.
:::
