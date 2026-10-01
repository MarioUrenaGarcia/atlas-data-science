---
id: paradoja-del-cumpleanos
titulo: Paradoja del cumpleaños
titulo_en: Birthday paradox
alias:
  - problema del cumpleaños
  - coincidencia de cumpleaños
modulo: 1
submodulo: '1.2'
orden: 13
nivel: basico
prerrequisitos:
  - regla-de-la-cadena-de-probabilidad
  - propiedades-derivadas-de-los-axiomas
etiquetas:
  - coincidencias
  - complemento
  - parejas
  - colisiones
resumen: >
  En un grupo de solo 23 personas, la probabilidad de que dos compartan cumpleaños ya supera 1/2,
  porque lo que crece rápido es el número de parejas, no el de personas.
formula: 'P(\text{coincidencia}) = 1 - \frac{365 \cdot 364 \cdots (365 - n + 1)}{365^{n}}'
visualizacion:
  componente: BirthdayParadox
  parametros:
    personas: 23
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.6'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

¿Cuántas personas hacen falta en un salón para que sea más probable que no que dos cumplan años el mismo día? La mayoría responde un número cercano a 183, la mitad de 365. La respuesta es 23.

La intuición falla porque piensa en una persona fija: la probabilidad de que alguien comparta **mi** cumpleaños con 22 personas más es de apenas 6 %. Pero la pregunta es si **algún par** coincide, y con 23 personas hay $\binom{23}{2} = 253$ parejas, cada una con probabilidad 1/365 de coincidir. Con tantas oportunidades, una coincidencia deja de ser sorprendente.

La forma más sencilla de calcularlo es por el complemento: la probabilidad de que todos los cumpleaños sean distintos se obtiene con la regla de la cadena, persona por persona. La segunda debe evitar un día, la tercera dos, y así sucesivamente. El producto de esas probabilidades cae rápidamente.

## Definición

Supuestos: los cumpleaños de las $n$ personas son independientes y cada uno es igualmente probable en cualquiera de los 365 días (se ignoran el 29 de febrero y las variaciones estacionales de nacimientos).

:::teorema[Probabilidad de al menos una coincidencia]
$$
P(\text{al menos dos comparten cumpleaños}) = 1 - \prod_{k=0}^{n-1}\frac{365 - k}{365} = 1 - \frac{365!}{(365 - n)!\,365^{n}}, \qquad n \le 365.
$$
Para $n > 365$ la probabilidad es 1 por el principio del palomar.
:::

:::demostracion
Por la regla de la cadena, la probabilidad de que todos sean distintos es $\frac{365}{365}\cdot\frac{364}{365}\cdots\frac{365-n+1}{365}$: la persona $k + 1$ debe caer en uno de los $365 - k$ días que siguen libres. El resultado es el complemento.
:::

:::figura[Un grupo de 40 personas: la probabilidad de alguna coincidencia es 0.891, y en la mayoría de los grupos simulados aparece al menos un día compartido.]{componente="BirthdayParadox"}
```yaml
personas: 40
grupos: 500
```
:::

:::nota[Qué significa cada símbolo]
- $n$: número de personas en el grupo.
- $365$: días posibles, todos igualmente probables; $d$ en la versión general.
- $\prod_{k=0}^{n-1}$: producto de los factores para $k = 0, 1, \dots, n-1$.
- $\frac{365 - k}{365}$: probabilidad de que la persona $k + 1$ evite los $k$ días ya ocupados.
- $!$: factorial.
- $\binom{n}{2}$: número de parejas que se pueden formar con $n$ personas.
- $e^{x}$ o $\exp(x)$: función exponencial; $\approx$: aproximadamente igual.
- $\log$: logaritmo natural.
:::

## Cómo usar la visualización

Cada paso simula un grupo nuevo: sus cumpleaños se marcan en una rejilla de 365 días, y los días compartidos se destacan. La gráfica inferior muestra la curva exacta de la probabilidad de coincidencia según el tamaño del grupo, con un círculo vacío en el valor exacto del tamaño elegido y un punto relleno en la proporción simulada.

Con 23 personas la probabilidad es 0.507 y la proporción simulada oscila alrededor de ese valor. Con 10 personas baja a 0.117; con 50 sube a 0.970; con 70 es 0.999. Las líneas punteadas marcan el tamaño mínimo para alcanzar 50 %.

## Ejemplo

Un equipo de futbol tiene 11 jugadores en la cancha. ¿Qué probabilidad hay de que dos compartan cumpleaños?

1. Todos distintos: $\frac{365}{365}\cdot\frac{364}{365}\cdots\frac{355}{365}$.
2. Producto: aproximadamente $0.859$.
3. Al menos una coincidencia: $1 - 0.859 = 0.141$.
4. Si se cuentan además los dos equipos y el árbitro (23 personas en la cancha), la probabilidad es $0.507$: en la mitad de los partidos de futbol profesional hay una coincidencia de cumpleaños entre las personas en la cancha.

:::figura[El equipo de 11 jugadores: la probabilidad exacta es 0.141, y en la mayoría de los grupos simulados no hay coincidencias.]{componente="BirthdayParadox"}
```yaml
personas: 11
grupos: 500
```
:::

## Propiedades

- **Aproximación exponencial:** como $1 - k/365 \approx e^{-k/365}$, la probabilidad de que todos sean distintos es aproximadamente $e^{-n(n-1)/730}$, es decir, $e^{-\binom{n}{2}/365}$.
- **Escala de la raíz cuadrada:** con $d$ días posibles, el tamaño de grupo para 50 % es aproximadamente $1.18\sqrt{d}$. Para $d = 365$ da cerca de 22.5.
- **Coincidencia con una persona fija:** la probabilidad de que alguien de otros $n - 1$ comparta el cumpleaños de una persona dada es $1 - (364/365)^{n-1}$; con $n = 23$ es solo 0.059.
- **Distribución real de nacimientos:** como los nacimientos no son uniformes en el año, la probabilidad real de coincidencia es ligeramente mayor que la calculada.

:::figura[La escala de la raíz cuadrada con 100 días posibles en lugar de 365 (por ejemplo, los últimos dos dígitos de un número de teléfono): bastan 13 personas para superar 1/2.]{componente="BirthdayParadox"}
```yaml
personas: 13
dias: 100
grupos: 500
```
:::

## Errores comunes

- **Pensar en coincidencias con una persona fija.** La pregunta es por cualquier pareja; el número de parejas crece como $n^2/2$.
- **Dividir $n$ entre 365.** La probabilidad no es proporcional al tamaño del grupo: con 23 personas no es $23/365 \approx 0.06$.
- **Sumar las probabilidades de las parejas.** $253/365 \approx 0.69$ cuenta varias veces los grupos con más de una coincidencia; la respuesta exacta es 0.507.

:::figura[Con 5 personas la probabilidad es solo 0.027: el crecimiento es lento al principio y se acelera porque las parejas crecen con el cuadrado del tamaño del grupo.]{componente="BirthdayParadox"}
```yaml
personas: 5
grupos: 500
```
:::

## Conexiones

El cálculo usa la [[regla-de-la-cadena-de-probabilidad]] sobre el complemento ([[propiedades-derivadas-de-los-axiomas]]) y el conteo de parejas con [[combinaciones]]. Para $n > 365$ se reduce al [[principio-del-palomar]]. Su versión general describe las colisiones en funciones hash y los ataques de cumpleaños en criptografía, y está relacionado con el [[problema-del-coleccionista-de-cupones]], que pregunta cuántas extracciones se necesitan para ver todos los valores en lugar de ver uno repetido.

## Formulario

:::formula[Probabilidad de coincidencia]
$$
P(\text{coincidencia}) = 1 - \prod_{k=0}^{n-1}\frac{365 - k}{365}
$$

- $n$: personas; cada factor es la probabilidad de evitar los días ya ocupados.
:::

:::formula[Versión con d días]
$$
P(\text{coincidencia}) = 1 - \frac{d!}{(d - n)!\,d^{n}}
$$

- $d$: número de valores igualmente probables; $n \le d$.
:::

:::formula[Aproximación exponencial]
$$
P(\text{todos distintos}) \approx \exp\!\left(-\frac{n(n-1)}{2d}\right)
$$

- $\frac{n(n-1)}{2} = \binom{n}{2}$: número de parejas.
:::

:::formula[Tamaño para probabilidad p]
$$
n \approx \sqrt{2d \log\frac{1}{1-p}}, \qquad n_{1/2} \approx 1.18\sqrt{d}
$$

- $p$: probabilidad de coincidencia buscada; $\log$: logaritmo natural.
:::

:::formula[Coincidencia con una persona fija]
$$
P = 1 - \left(\frac{364}{365}\right)^{n-1}
$$

- $n - 1$: personas que podrían compartir el cumpleaños de la persona fija.
:::
