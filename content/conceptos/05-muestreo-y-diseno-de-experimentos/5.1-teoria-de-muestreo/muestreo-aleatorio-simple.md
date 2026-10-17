---
id: muestreo-aleatorio-simple
titulo: Muestreo aleatorio simple
titulo_en: Simple random sampling
alias:
  - MAS
  - muestreo aleatorio simple sin reemplazo
  - SRS
modulo: 5
submodulo: '5.1'
orden: 2
nivel: basico
prerrequisitos:
  - marco-muestral
  - parametro-y-estadistico
  - espacios-equiprobables
relaciones:
  - tipo: relacionado
    id: muestreo-con-y-sin-reemplazo
  - tipo: contrasta
    id: muestreo-por-conveniencia
etiquetas:
  - muestreo probabilístico
  - aleatorización
  - estimador insesgado
  - media muestral
  - encuestas
resumen: >
  Diseño en el que todos los subconjuntos de n unidades de la población tienen la misma probabilidad
  de ser la muestra. La media muestral estima sin sesgo la media poblacional y su precisión se conoce.
formula: 'P(\mathcal{S} = s) = \frac{1}{\binom{N}{n}} \quad \text{para todo } s \subseteq U \text{ con } |s| = n'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: mas
    n: 20
    nMaximo: 120
    repeticiones: 400
    poblacion:
      columnas: 20
      filas: 12
      estratos:
        - nombre: Colonia
          media: 1800
      desviacion: 450
      icc: 0.2
      minimo: 400
      decimales: 0
      variable: Gasto semanal en alimentos
      unidad: pesos
      nombreUnidad: Hogar
referencias:
  - clave: lohr
    capitulo: '2'
  - clave: casella-berger
publicado: true
---

## Intuición

Para elegir a quién entrevistar en una colonia de 240 hogares, se puede escribir el número de cada hogar en un papel, meter los 240 papeles en una urna, revolver bien y sacar 20 sin devolverlos. Nadie decide quién entra: el azar lo hace, y lo hace sin preferencias. Un hogar del centro tiene la misma oportunidad que uno de la orilla, y una pareja de hogares cualquiera tiene la misma oportunidad de salir junta que cualquier otra pareja.

Esa ausencia de preferencias es lo que da valor al método. Una muestra concreta puede salir, por mala suerte, con hogares que gastan más que el promedio; pero no hay ningún mecanismo que empuje a las muestras siempre hacia el mismo lado. Si el procedimiento se repitiera muchas veces, las medias de las muestras se repartirían alrededor de la media verdadera de la colonia, y esa dispersión se puede calcular de antemano. El **muestreo aleatorio simple** es el diseño más sencillo con esa garantía y la referencia contra la que se comparan todos los demás.

## Definición

:::definicion[Muestreo aleatorio simple]
Sea $U = \{1, \dots, N\}$ una población finita listada en un marco muestral. Un **muestreo aleatorio simple sin reemplazo** de tamaño $n$ es un diseño en el que cada uno de los $\binom{N}{n}$ subconjuntos de $n$ unidades distintas tiene la misma probabilidad de ser la muestra:
$$
P(\mathcal{S} = s) = \frac{1}{\binom{N}{n}} \qquad \text{para todo } s \subseteq U \text{ con } |s| = n.
$$
:::

De la definición se sigue que cada unidad tiene probabilidad de inclusión
$$
\pi_i = P(i \in \mathcal{S}) = \frac{\binom{N-1}{n-1}}{\binom{N}{n}} = \frac{n}{N},
$$
porque de los subconjuntos posibles, los que contienen a la unidad $i$ son los que eligen las otras $n-1$ unidades entre las $N-1$ restantes.

Si $y_1, \dots, y_N$ son los valores de la población, con media $\bar{Y} = \frac{1}{N}\sum_{i=1}^{N} y_i$ y varianza $S^2 = \frac{1}{N-1}\sum_{i=1}^{N} (y_i - \bar{Y})^2$, el estimador natural es la media muestral $\bar{y} = \frac{1}{n}\sum_{i \in \mathcal{S}} y_i$. Bajo este diseño,
$$
\mathbb{E}[\bar{y}] = \bar{Y}, \qquad \operatorname{Var}(\bar{y}) = \left(1 - \frac{n}{N}\right)\frac{S^2}{n}.
$$

La aleatoriedad está en la selección, no en los valores: los $y_i$ son números fijos y lo único aleatorio es qué subconjunto se observa.

:::nota[Qué significa cada símbolo]
- $U$: población finita de unidades, numeradas de $1$ a $N$.
- $N$: tamaño de la población; $n$: tamaño de la muestra.
- $\mathcal{S}$: la muestra, un subconjunto aleatorio de $U$; $s$: un subconjunto particular.
- $\binom{N}{n}$: número de subconjuntos distintos de $n$ unidades.
- $\pi_i$: probabilidad de que la unidad $i$ quede en la muestra.
- $y_i$: valor de la variable en la unidad $i$.
- $\bar{Y}$: media de la población (el parámetro); $\bar{y}$: media de la muestra (el estimador).
- $S^2$: varianza de la población con denominador $N - 1$.
- $1 - n/N$: fracción de la población que no se observa.
:::

## Cómo usar la visualización

La rejilla representa 240 hogares de una colonia; el tono de cada punto indica su gasto semanal en alimentos. Al reproducir, se extraen 20 hogares uno por uno y el encabezado va sumando sus gastos hasta calcular $\bar{y}$. Después el diseño se repite: cada nueva muestra aporta una barra al histograma de abajo, que se forma alrededor de la línea de la media real $\bar{Y}$.

Experimentos sugeridos:

- Observa que el promedio de las estimaciones coincide con la media real: el sesgo observado se acerca a cero.
- Aumenta $n$ a 80 y compara el error estándar observado con el teórico: el histograma se angosta.
- Cambia la semilla: la población y las muestras cambian, pero la forma del histograma se conserva.

## Ejemplo

Una nutrióloga quiere estimar el gasto semanal promedio en alimentos de los 240 hogares de una colonia. Por estudios previos se sabe que la desviación estándar del gasto es de unos 450 pesos. Toma un muestreo aleatorio simple de $n = 20$ hogares.

1. Hay $\binom{240}{20} \approx 2.6 \times 10^{28}$ muestras posibles, todas igual de probables.
2. Cada hogar entra con probabilidad $\pi_i = 20/240 = 0.083$.
3. Si la muestra obtenida da $\bar{y} = 1762$ pesos.
4. El error estándar es $\sqrt{(1 - 20/240)\cdot 450^2/20} = \sqrt{0.917 \cdot 10125} \approx 96.4$ pesos.
5. La estimación se reporta como $1762$ pesos con un error estándar cercano a 96: muestras distintas habrían dado valores típicamente a unos 100 pesos de la media real.

:::figura[Una sola muestra aleatoria simple de 20 hogares. El encabezado suma los gastos de los hogares elegidos y los divide entre 20.]{componente="SurveySampler"}
```yaml
diseno: mas
n: 20
repeticiones: 1
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Colonia
      media: 1800
  desviacion: 450
  icc: 0.2
  minimo: 400
  decimales: 0
  variable: Gasto semanal en alimentos
  unidad: pesos
  nombreUnidad: Hogar
```
:::

## Propiedades

- **Insesgamiento.** $\mathbb{E}[\bar{y}] = \bar{Y}$ para cualquier población y cualquier $n$; no hace falta suponer normalidad.
- **Varianza conocida.** $\operatorname{Var}(\bar{y}) = (1 - n/N)\,S^2/n$, de modo que el error estándar baja como $1/\sqrt{n}$ y se anula cuando $n = N$ (censo).
- **Equiprobabilidad de unidades y de parejas.** Además de $\pi_i = n/N$, la probabilidad de que dos unidades distintas entren juntas es $\pi_{ij} = \frac{n(n-1)}{N(N-1)}$, la misma para todas las parejas.
- **Estimación de la varianza.** La varianza muestral $s^2 = \frac{1}{n-1}\sum_{i \in \mathcal{S}}(y_i - \bar{y})^2$ es un estimador insesgado de $S^2$, así que el error estándar se puede estimar con la misma muestra.

:::figura[Propiedad de insesgamiento: con 400 muestras de proporciones de hogares que reciben un apoyo social, el promedio de las estimaciones coincide con la proporción real de la colonia.]{componente="SurveySampler"}
```yaml
diseno: mas
n: 25
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Colonia
      media: 0.3
  desviacion: 1
  icc: 0.1
  binaria: true
  variable: Recibe apoyo social
  nombreUnidad: Hogar
```
:::

:::figura[Propiedad de la varianza: con muestras de 80 hogares el histograma es más angosto que con 20. El error estándar teórico baja de 96 a 41 pesos.]{componente="SurveySampler"}
```yaml
diseno: mas
n: 80
nMaximo: 200
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Colonia
      media: 1800
  desviacion: 450
  icc: 0.2
  minimo: 400
  decimales: 0
  variable: Gasto semanal en alimentos
  unidad: pesos
  nombreUnidad: Hogar
```
:::

## Errores comunes

- **Confundir aleatorio con arbitrario.** Elegir "al azar" a las personas que pasan por una plaza no es muestreo aleatorio simple: las probabilidades de inclusión son desconocidas y distintas. Sin un mecanismo de sorteo sobre un marco, la fórmula de la varianza no aplica.
- **Pensar que una muestra aleatoria se parece siempre a la población.** El diseño garantiza que no hay sesgo en promedio, no que cada muestra sea representativa. Con $n$ pequeño, una muestra puede alejarse bastante de $\bar{Y}$.
- **Creer que el tamaño de la población determina la precisión.** El error estándar depende sobre todo de $n$; el factor $1 - n/N$ solo pesa cuando la muestra es una fracción grande de la población.

:::figura[Error de confundir aleatorio con arbitrario: tomar los 20 hogares más cercanos a la entrada de la colonia produce estimaciones que se alejan sistemáticamente de la media real, mientras que el muestreo aleatorio simple queda centrado en ella.]{componente="SurveySampler"}
```yaml
diseno: conveniencia
disenos: [conveniencia, mas]
n: 20
repeticiones: 300
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Colonia
      media: 1800
  desviacion: 450
  icc: 0.2
  tendencia: 1200
  minimo: 400
  decimales: 0
  variable: Gasto semanal en alimentos
  unidad: pesos
  nombreUnidad: Hogar
```
:::

:::figura[Error de esperar que cada muestra se parezca a la población: con solo 5 hogares, muchas muestras quedan a más de 300 pesos de la media real aunque el diseño no tenga sesgo.]{componente="SurveySampler"}
```yaml
diseno: mas
n: 5
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Colonia
      media: 1800
  desviacion: 450
  icc: 0.2
  minimo: 400
  decimales: 0
  variable: Gasto semanal en alimentos
  unidad: pesos
  nombreUnidad: Hogar
```
:::

## Conexiones

El muestreo aleatorio simple necesita un [[marco-muestral]] y se apoya en el conteo de [[combinaciones]]. La media muestral que produce es un [[parametro-y-estadistico|estadístico]] que estima un parámetro, y su comportamiento al crecer $n$ lo describen la [[ley-debil-de-los-grandes-numeros]] y el [[teorema-central-del-limite]]. Es la referencia contra la que se mide el efecto de diseños más elaborados y se contrasta con el [[muestreo-por-conveniencia]], que no tiene probabilidades de inclusión conocidas.

## Formulario

:::formula[Probabilidad de cada muestra]
$$
P(\mathcal{S} = s) = \frac{1}{\binom{N}{n}}
$$

- $\mathcal{S}$: muestra aleatoria; $s$: un subconjunto de $n$ unidades.
- $N$: tamaño de la población; $n$: tamaño de la muestra.
- $\binom{N}{n}$: número de muestras posibles.
:::

:::formula[Probabilidad de inclusión]
$$
\pi_i = \frac{n}{N}, \qquad \pi_{ij} = \frac{n(n-1)}{N(N-1)}
$$

- $\pi_i$: probabilidad de que la unidad $i$ quede en la muestra.
- $\pi_{ij}$: probabilidad de que las unidades $i$ y $j$, distintas, queden juntas.
:::

:::formula[Media muestral]
$$
\bar{y} = \frac{1}{n}\sum_{i \in \mathcal{S}} y_i, \qquad \mathbb{E}[\bar{y}] = \bar{Y}
$$

- $y_i$: valor de la unidad $i$.
- $\bar{y}$: media de la muestra; $\bar{Y}$: media de la población.
- $\mathbb{E}[\cdot]$: promedio sobre todas las muestras posibles del diseño.
:::

:::formula[Varianza de la media muestral]
$$
\operatorname{Var}(\bar{y}) = \left(1 - \frac{n}{N}\right)\frac{S^2}{n}, \qquad S^2 = \frac{1}{N-1}\sum_{i=1}^{N}(y_i - \bar{Y})^2
$$

- $S^2$: varianza de la población con denominador $N - 1$.
- $1 - n/N$: factor de corrección por población finita.
- $\operatorname{Var}(\bar{y})$: varianza de $\bar{y}$ entre muestras; su raíz es el error estándar.
:::

:::formula[Varianza muestral]
$$
s^2 = \frac{1}{n-1}\sum_{i \in \mathcal{S}}(y_i - \bar{y})^2, \qquad \mathbb{E}[s^2] = S^2
$$

- $s^2$: varianza calculada con la muestra; estima sin sesgo a $S^2$.
:::
