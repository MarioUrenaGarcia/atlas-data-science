---
id: asignacion-proporcional-y-asignacion-de-neyman
titulo: Asignación proporcional y asignación de Neyman
titulo_en: Proportional and Neyman allocation
alias:
  - asignación óptima
  - asignación de Neyman
  - asignación proporcional
modulo: 5
submodulo: '5.1'
orden: 5
nivel: intermedio
prerrequisitos:
  - muestreo-estratificado
  - optimizacion-con-restricciones
relaciones:
  - tipo: relacionado
    id: desviacion-estandar-muestral
etiquetas:
  - estratos
  - tamaño de muestra
  - optimización
  - costos
resumen: >
  Reglas para repartir el tamaño de muestra entre estratos. La proporcional sigue el tamaño de cada
  estrato; la de Neyman también su desviación estándar y minimiza la varianza para un n fijo.
formula: 'n_h^{\mathrm{prop}} = n\,\frac{N_h}{N}, \qquad n_h^{\mathrm{Ney}} = n\,\frac{N_h S_h}{\sum_k N_k S_k}'
visualizacion:
  componente: SamplingWeights
  parametros:
    modo: asignacion
    asignacion: neyman
    n: 200
    variable: Ingresos anuales
    unidad: millones de pesos
    estratos:
      - nombre: Micro
        N: 3000
        S: 0.4
      - nombre: Pequeñas
        N: 800
        S: 2
      - nombre: Medianas
        N: 200
        S: 9
referencias:
  - clave: lohr
    capitulo: '3'
publicado: true
---

## Intuición

Una cámara de comercio quiere estimar los ingresos promedio de 4000 empresas y puede entrevistar a 200. Divide el padrón en microempresas, pequeñas y medianas. La pregunta ya no es si estratificar, sino cuántas entrevistas asignar a cada grupo.

La respuesta más natural es repartir según el tamaño: si tres cuartas partes de las empresas son micro, tres cuartas partes de las entrevistas van a ellas. Es la **asignación proporcional**. Pero las microempresas se parecen mucho entre sí en ingresos, mientras que las medianas varían enormemente: hay medianas que facturan diez veces más que otras. Cada entrevista a una microempresa confirma lo que ya se sabía; cada entrevista a una mediana reduce mucho la incertidumbre. La **asignación de Neyman** manda más entrevistas a donde hay más variación, en proporción al tamaño del estrato multiplicado por su desviación estándar. Con el mismo número de entrevistas, la varianza del estimador puede bajar a una fracción.

## Definición

:::definicion[Asignación proporcional y de Neyman]
En un muestreo estratificado con $H$ estratos de tamaños $N_h$ y desviaciones estándar $S_h$, y un tamaño total $n$:

- **Asignación proporcional:** $n_h = n\,\dfrac{N_h}{N}$.
- **Asignación de Neyman:** $n_h = n\,\dfrac{N_h S_h}{\sum_{k=1}^{H} N_k S_k}$.
- **Asignación óptima con costos:** si observar una unidad del estrato $h$ cuesta $c_h$, la asignación que minimiza la varianza para un costo total fijo es $n_h \propto N_h S_h / \sqrt{c_h}$.
:::

La asignación de Neyman se obtiene minimizando $\operatorname{Var}(\bar{y}_{st}) = \sum_h W_h^2 (1 - n_h/N_h) S_h^2 / n_h$ sujeto a $\sum_h n_h = n$ con un multiplicador de Lagrange: la condición de primer orden da $W_h^2 S_h^2 / n_h^2 = \lambda$, es decir, $n_h \propto W_h S_h$. En la práctica los $n_h$ se redondean, se exige al menos una o dos unidades por estrato y, si algún $n_h$ resulta mayor que $N_h$, ese estrato se censa y el resto se reparte otra vez.

:::nota[Qué significa cada símbolo]
- $n$: tamaño de muestra total; $n_h$: tamaño asignado al estrato $h$.
- $N_h$: tamaño del estrato; $N = \sum_h N_h$; $W_h = N_h/N$.
- $S_h$: desviación estándar de la variable dentro del estrato $h$, que se conoce o se anticipa con datos previos.
- $c_h$: costo de observar una unidad del estrato $h$.
- $\lambda$: multiplicador de Lagrange de la restricción $\sum_h n_h = n$.
:::

## Cómo usar la visualización

Cada bloque es un estrato: su ancho es proporcional a $N_h$ y su altura a $S_h$. Al reproducir, las 200 entrevistas se entregan una por una al estrato que más se aleja de su cuota, y el encabezado muestra el cálculo de $n_h$. Al terminar aparece la varianza del estimador; las barras de abajo comparan la varianza con cada regla.

Experimentos sugeridos:

- Cambia la regla a proporcional: casi todas las entrevistas van a las microempresas y la varianza se multiplica por más de cuatro.
- Con la regla de Neyman, reduce $n$ a 40 y observa que las medianas siguen recibiendo la mayor parte.
- Compara la asignación igual con las otras dos: a veces es mejor que la proporcional, nunca mejor que la de Neyman.

## Ejemplo

Con los datos de la visualización ($n = 200$):

1. Proporcional: $W_h = 0.75, 0.20, 0.05$, así que $n_h = 150, 40, 10$.
2. Neyman: $N_h S_h = 1200, 1600, 1800$, suma $4600$; $n_h = 200 \cdot 1200/4600 \approx 52$, $200 \cdot 1600/4600 \approx 70$ y $200 \cdot 1800/4600 \approx 78$.
3. Varianza proporcional: $0.5625 \cdot 0.95 \cdot \frac{0.16}{150} + 0.04 \cdot 0.95 \cdot \frac{4}{40} + 0.0025 \cdot 0.95 \cdot \frac{81}{10} = 0.0236$; error estándar $0.154$ millones.
4. Varianza de Neyman: $0.5625 \cdot 0.983 \cdot \frac{0.16}{52} + 0.04 \cdot 0.913 \cdot \frac{4}{70} + 0.0025 \cdot 0.61 \cdot \frac{81}{78} = 0.0054$; error estándar $0.073$ millones.
5. Con el mismo número de entrevistas, la varianza baja 77 %: para lograrlo con asignación proporcional harían falta casi cuatro veces más entrevistas (unas 750).

:::figura[La asignación proporcional del ejemplo: 150 entrevistas a microempresas, 40 a pequeñas y 10 a medianas.]{componente="SamplingWeights"}
```yaml
modo: asignacion
asignacion: proporcional
n: 200
variable: Ingresos anuales
unidad: millones de pesos
estratos:
  - nombre: Micro
    N: 3000
    S: 0.4
  - nombre: Pequeñas
    N: 800
    S: 2
  - nombre: Medianas
    N: 200
    S: 9
```
:::

## Propiedades

- **Neyman minimiza la varianza** entre todas las asignaciones con el mismo $n$ (salvo por redondeo y la corrección por población finita).
- **Si todas las $S_h$ son iguales, Neyman coincide con la proporcional.**
- **La proporcional nunca es peor que el muestreo aleatorio simple** (para estratos grandes), aunque las $S_h$ sean desconocidas; Neyman puede ser peor si las $S_h$ anticipadas están muy equivocadas.
- **Los costos desplazan la muestra hacia los estratos baratos:** con $n_h \propto N_h S_h/\sqrt{c_h}$, un estrato cuatro veces más caro recibe la mitad de unidades que recibiría sin costos.

:::figura[Propiedad de coincidencia: tres hospitales con la misma variabilidad en el tiempo de espera. Las asignaciones de Neyman y proporcional dan los mismos tamaños y la misma varianza.]{componente="SamplingWeights"}
```yaml
modo: asignacion
asignacion: neyman
n: 90
variable: Tiempo de espera
unidad: min
estratos:
  - nombre: Hospital A
    N: 1200
    S: 25
  - nombre: Hospital B
    N: 600
    S: 25
  - nombre: Hospital C
    N: 300
    S: 25
```
:::

:::figura[Propiedad de los costos: encuestar escuelas rurales cuesta nueve veces más que las urbanas. La asignación óptima con costos manda menos encuestas al estrato rural que la de Neyman.]{componente="SamplingWeights"}
```yaml
modo: asignacion
asignacion: optima
n: 120
variable: Horas de clase perdidas
unidad: h
estratos:
  - nombre: Urbanas
    N: 400
    S: 6
    costo: 1
  - nombre: Semiurbanas
    N: 250
    S: 9
    costo: 3
  - nombre: Rurales
    N: 150
    S: 14
    costo: 9
```
:::

## Errores comunes

- **Pedir más unidades de las que tiene el estrato.** Si $N_h$ es pequeño y $S_h$ grande, la fórmula de Neyman puede dar $n_h > N_h$. Ese estrato se censa completo y las unidades sobrantes se reparten entre los demás.
- **Asignar en proporción a la varianza en lugar de la desviación estándar.** La regla óptima usa $S_h$, no $S_h^2$; usar la varianza exagera la muestra de los estratos más dispersos.
- **Olvidar los pesos al estimar.** Con asignación de Neyman la muestra no refleja la composición de la población; la media simple de todas las observaciones está sesgada hacia los estratos sobremuestreados.

:::figura[Error de pedir más unidades de las que hay: solo existen 30 corporativos y la regla de Neyman pediría más; el estrato se censa y las 130 entrevistas restantes se reparten otra vez con la regla de Neyman entre los locales y los regionales (56 y 74).]{componente="SamplingWeights"}
```yaml
modo: asignacion
asignacion: neyman
n: 160
variable: Gasto en publicidad
unidad: millones de pesos
estratos:
  - nombre: Locales
    N: 2500
    S: 0.3
  - nombre: Regionales
    N: 400
    S: 2.5
  - nombre: Corporativos
    N: 30
    S: 40
```
:::

## Conexiones

La asignación es la decisión central de un [[muestreo-estratificado]]. La regla de Neyman es un problema de [[optimizacion-con-restricciones]] resuelto con un multiplicador de Lagrange, y requiere anticipar la [[desviacion-estandar-muestral|desviación estándar]] de cada estrato. Cuando los estratos se sobremuestrean o submuestrean, la estimación necesita pesos, el mismo principio que la ponderación y post-estratificación.

## Formulario

:::formula[Asignación proporcional]
$$
n_h = n\,\frac{N_h}{N}
$$

- $n$: tamaño total; $N_h$: tamaño del estrato; $N$: tamaño de la población.
:::

:::formula[Asignación de Neyman]
$$
n_h = n\,\frac{N_h S_h}{\sum_{k=1}^{H} N_k S_k}
$$

- $S_h$: desviación estándar dentro del estrato $h$.
- $H$: número de estratos; $k$: índice de suma.
:::

:::formula[Asignación óptima con costos]
$$
n_h \propto \frac{N_h S_h}{\sqrt{c_h}}
$$

- $c_h$: costo de observar una unidad del estrato $h$.
:::

:::formula[Varianza mínima con asignación de Neyman]
$$
\operatorname{Var}_{\mathrm{Ney}}(\bar{y}_{st}) = \frac{1}{n}\left(\sum_{h=1}^{H} W_h S_h\right)^2 - \frac{1}{N}\sum_{h=1}^{H} W_h S_h^2
$$

- $W_h = N_h/N$: peso del estrato.
- El segundo término es la corrección por población finita.
:::
